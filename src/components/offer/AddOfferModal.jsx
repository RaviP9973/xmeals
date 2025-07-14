import { useRef, useState } from "react";
import useOnClickOutside from "../../hooks/useOnCllickOutside";
import TransparentLoader from "../TransparentLoader";

const AddOfferModal = ({ open, onClose, onAdd, editingBanner }) => {
  if (!open) return null;

  const [link, setLink] = useState(editingBanner ? editingBanner?.link : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ image: "", link: "" });

  const ref = useRef(null);
  useOnClickOutside(ref, () => onClose());

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingBanner ? editingBanner?.image_url : null);
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
      setError((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setImage(null);
    document.getElementById("cuisine-image-input").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    let newError = { image: "", link: "" };

    // Validation for image
    if (!imagePreview && !image) {
      newError.image = "Banner image is required";
      hasError = true;
    }
    // Validation for link
    if (!link.trim()) {
      newError.link = "Link is required";
      hasError = true;
    }

    setError(newError);

    if (hasError) return;

    setLoading(true);
    await onAdd({ image, link }); // Pass image file and link to parent
    setLoading(false);
    setImage(null);
    setImagePreview(null);
    setLink("");
    setError({ image: "", link: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg"
        ref={ref}
      >
        <h2 className="text-lg font-bold mb-4 text-orange-500">
          Add Offer Banner
        </h2>
        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Banner</label>
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
                  type="button"
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
          {error.image && (
            <div className="text-red-500 text-xs mt-1">{error.image}</div>
          )}
        </div>
        <label className="block mb-2 font-medium">Link</label>
        <input
          type="text"
          className={`w-full border ${error.link ? "border-red-400" : "border-gray-300"} rounded p-2 mb-1`}
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            if (e.target.value.trim()) setError((prev) => ({ ...prev, link: "" }));
          }}
          placeholder="https://your-offer-link.com"
        />
        {error.link && (
          <div className="text-red-500 text-xs mb-3">{error.link}</div>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary text-white hover:bg-orange-600"
            disabled={loading}
          >
            submit
          </button>
        </div>
      </form>

      {loading && <TransparentLoader/>}
    </div>
  );
};

export default AddOfferModal;