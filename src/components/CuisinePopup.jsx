import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useOnClickOutside from "../hooks/useOnCllickOutside";
import Loader from "./Loader";

const CuisinePopup = ({ cuisine, onClose, onSave }) => {
  const [closing, setClosing] = useState(false);
  const ref = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      keywords: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  const [image, setImage] = useState(cuisine?.image_url || null);
  const [imagePreview, setImagePreview] = useState(cuisine?.image_url || null);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };
  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    document.getElementById("cuisine-image-input").value = "";
  };
  useEffect(() => {
    if (cuisine) {
      reset({
        name: cuisine.name || "",
        keywords: Array.isArray(cuisine.keywords)
          ? cuisine.keywords.join(", ")
          : cuisine.keywords || "",
      });
    } else {
      reset({
        name: "",
        keywords: "",
      });
    }
  }, [cuisine, reset]);

  const onSubmit = (data) => {
    const { name, keywords } = data;
    const keywordArray = keywords
      .split(",")
      .map((kw) => kw.trim())
      .filter((kw) => kw.length > 0);

    onSave({
      c_id: cuisine?.c_id,
      name: name.trim(),
      keywords: keywordArray,
      image:
        imagePreview && imagePreview !== cuisine?.image
          ? image
          : cuisine?.image || null,
    });
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useOnClickOutside(ref, handleClose);

  const [keywordErrors, setKeywordErrors] = useState([]);
  const [isKeywordValid, setIsKeywordValid] = useState(true);

  const validateKeyword = (keyword) => {
    if (!keyword || keyword.trim().length === 0) {
      return "Keyword cannot be empty";
    }

    const trimmed = keyword.trim();
    if (trimmed.length < 2) {
      return "Keyword must be at least 2 characters";
    }
    if (trimmed.length > 30) {
      return "Keyword cannot exceed 30 characters";
    }
    if (!/^[A-Za-z\s-]+$/.test(trimmed)) {
      return "Keyword can only contain letters, spaces, and hyphens";
    }
    return null;
  };

  const handleKeyDown = (e) => {
    if (e.key === ",") {
      e.preventDefault();
      const input = e.target.value;
      const keywords = input
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0);
      const currentKeyword = keywords[keywords.length - 1];

      // Check for empty input
      if (!currentKeyword || currentKeyword.trim().length === 0) {
        setIsKeywordValid(false);
        setKeywordErrors((prev) => [
          ...prev,
          {
            keyword: "Empty",
            error: "Keyword cannot be empty",
          },
        ]);

        setTimeout(() => {
          setKeywordErrors((prev) =>
            prev.filter((err) => err.keyword !== "Empty")
          );
        }, 3000);

        e.target.value =
          keywords.slice(0, -1).join(", ") + (keywords.length > 1 ? ", " : "");
        return;
      }

      // Check for maximum keywords limit
      if (keywords.length > 20) {
        setIsKeywordValid(false);
        setKeywordErrors((prev) => [
          ...prev,
          {
            keyword: currentKeyword,
            error: "Maximum limit of 20 keywords reached",
          },
        ]);

        setTimeout(() => {
          setKeywordErrors((prev) =>
            prev.filter((err) => err.keyword !== currentKeyword)
          );
        }, 3000);

        e.target.value = keywords.slice(0, 20).join(", ") + ", ";
        return;
      }

      // Check for duplicates
      const duplicateKeyword = keywords
        .slice(0, -1)
        .find((kw) => kw.toLowerCase() === currentKeyword.toLowerCase());

      if (duplicateKeyword) {
        setIsKeywordValid(false);
        setKeywordErrors((prev) => [
          ...prev,
          {
            keyword: currentKeyword,
            error: "Duplicate keyword not allowed",
          },
        ]);

        setTimeout(() => {
          setKeywordErrors((prev) =>
            prev.filter((err) => err.keyword !== currentKeyword)
          );
        }, 3000);

        e.target.value = keywords.slice(0, -1).join(", ") + ", ";
        return;
      }

      const error = validateKeyword(currentKeyword);
      if (error) {
        setIsKeywordValid(false);
        setKeywordErrors((prev) => [
          ...prev,
          {
            keyword: currentKeyword,
            error,
          },
        ]);
        setTimeout(() => {
          setKeywordErrors((prev) =>
            prev.filter((err) => err.keyword !== currentKeyword)
          );
        }, 3000);
      } else {
        setIsKeywordValid(true);
        const cleanedKeywords = [
          ...keywords.slice(0, -1),
          currentKeyword.trim(),
        ].filter((kw) => kw.length > 0);

        e.target.value = cleanedKeywords.join(", ") + ", ";
      }
    }
  };




  // if(loading){
  //   return <Loader/>
  // }
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/30 transition-opacity duration-300 ease-in-out">
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className={`bg-white w-full sm:w-[90%] md:w-[600px] rounded-t-2xl p-6 max-h-[85%] overflow-y-auto shadow-xl transform ${
          closing ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        <h3 className="text-xl font-bold mb-4 text-orange-500 ">
          {cuisine ? "Edit Cuisine" : "Add Cuisine"}
        </h3>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Cuisine Image</label>
          <div
            className={`relative border-2 border-dashed rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer h-[180px] overflow-hidden
          ${
            dragActive
              ? "border-orange-500 bg-orange-50"
              : "border-orange-300 bg-orange-100 hover:bg-orange-50"
          }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              document.getElementById("cuisine-image-input").click()
            }
          >
            <input
              id="cuisine-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Image Preview */}
            {imagePreview ? (
              <div className="absolute inset-0 p-2 pointer-events-none">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                  style={{ background: "#fff" }}
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white text-red-500 hover:text-red-700 p-1 rounded-full shadow pointer-events-auto"
                >
                  ✕
                </button>
              </div>
            ) : (
              // Upload Icon and Text
              <div className="flex flex-col items-center pointer-events-none">
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="orange"
                  className="mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  />
                </svg>
                <span className="text-lg font-semibold text-orange-500">
                  Drag & Drop files here
                </span>
                <span className="text-gray-500 my-2">or</span>
                <span className="inline-block px-4 py-2 bg-white border border-orange-400 text-orange-600 rounded-lg font-semibold shadow hover:bg-orange-50 transition-colors duration-200">
                  Browse Files
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <input
            className={`w-full p-2 border rounded transition-colors duration-200 ${
              errors.name
                ? "border-red-500 bg-red-50"
                : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="Cuisine Name"
            {...register("name", {
              required: "Cuisine name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long",
              },
              maxLength: {
                value: 50,
                message: "Name cannot exceed 50 characters",
              },
              pattern: {
                // Updated pattern to handle trailing spaces
                value: /^[A-Za-z]+(?:\s[A-Za-z]+)*\s*$/,
                message: "Name can only contain letters and spaces",
              },
              validate: {
                // Additional validation to trim spaces
                noExtraSpaces: (value) => {
                  const trimmed = value.trim();
                  return (
                    !trimmed.includes("  ") || "Multiple spaces are not allowed"
                  );
                },
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <textarea
            className={`w-full p-2 border rounded transition-colors duration-200 ${
              keywordErrors.length > 0
                ? "border-red-500 bg-red-50"
                : "border-gray-300 focus:border-blue-500"
            }`}
            rows={3}
            placeholder="Keywords (e.g., spicy, vegetarian, curry, noodles)"
            onKeyDown={handleKeyDown}
            {...register("keywords", {
              required: "At least one cuisine keyword is required",
              validate: {
                finalValidation: (value) => {
                  const keywords = value
                    .split(",")
                    .map((kw) => kw.trim())
                    .filter((kw) => kw.length > 0);

                  if (keywords.length === 0) {
                    return "At least one cuisine keyword is required";
                  }

                  if (keywords.length > 20) {
                    return "Maximum 20 keywords are allowed";
                  }

                  // Check for duplicates
                  const uniqueKeywords = new Set(
                    keywords.map((kw) => kw.toLowerCase())
                  );
                  if (keywords.length !== uniqueKeywords.size) {
                    return "Duplicate keywords are not allowed";
                  }

                  // Validate all keywords
                  const invalidKeywords = keywords.filter(
                    (kw) => validateKeyword(kw) !== null
                  );
                  if (invalidKeywords.length > 0) {
                    setIsKeywordValid(false);
                    return "Please fix invalid keywords before submitting";
                  }

                  setIsKeywordValid(true);
                  return true;
                },
              },
            })}
          />
          {/* Show real-time keyword errors */}
          {keywordErrors.map((error, index) => (
            <p
              key={index}
              className="text-red-500 text-sm mt-1 animate-fade-in"
            >
              "{error.keyword}": {error.error}
            </p>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-200"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || Object.keys(errors).length > 0}
            className={`py-2 px-6 rounded-lg transition-colors duration-200 ${
              !isValid || Object.keys(errors).length > 0
                ? "bg-orange-400 text-gray-500 cursor-not-allowed opacity-70"
                : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
          >
            Save
          </button>
        </div>
      </form>

      {/* Add this to your existing keyframes */}
      <style>{`
      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100%);
          opacity: 0;
        }
      }

      .animate-slide-up {
        animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      .animate-slide-down {
        animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fadeIn 0.2s ease-out forwards;
      }
    `}</style>
    </div>
  );
};

export default CuisinePopup;
