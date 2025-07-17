import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import CuisinePopup from "../components/CuisinePopup";
import {
  deleteCuisine,
  fetchAllCuisine,
  insertCuisine,
  updateCuisine,
  uploadImageToSupabase,
} from "../utils/cusine";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";
import { useToast } from "../components/customtoast/CustomToast";
import TransparentLoader from "../components/TransparentLoader";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";

const CuisineManager = () => {
  const [cuisines, setCuisines] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingCuisine, setEditingCuisine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { session } = useAuth();
  const { showToast } = useToast();
  const [cursor, setCursor] = useState({
    c_id: null,
    created_at: null,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cuisineToDelete, setCuisineToDelete] = useState(null);

  /**************** infinte scroll  *********/
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const lastCuisineRef = useCallback(
    (node) => {
      if (loading || loadingMore) return; // Fix: check both loading and loadingMore
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreCuisines();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, cuisines]
  );

  const loadMoreCuisines = async () => {
    if (loadingMore) return; // Prevent duplicate calls
    setLoadingMore(true);
    try {
      // const lastCuisine = cuisines[cuisines?.length - 1];
      const { data, success, error } = await fetchAllCuisine(
        cursor?.created_at,
        cursor?.c_id
      );

      if (error || !success) {
        showToast.error("Error loading more cuisines", "error", "long");
        setHasMore(false); // Stop further loading on error
        return;
      }

      setCursor({
        c_id: data[data?.length - 1]?.c_id,
        created_at: data[data?.length - 1]?.created_at,
      });
      if (!data || data.length === 0) {
        setHasMore(false); // No more data
      } else {
        setCuisines((prev) => [...prev, ...data]);
        if (data.length < pageSize) setHasMore(false); // Less than page size means no more data
      }
    } catch (err) {
      showToast("Something went wrong", "error", "long");
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchCuisine = async () => {
      setLoading(true);
      try {
        const { data, success, error } = await fetchAllCuisine();

        if (error || !success) {
          console.error(error);
          showToast("Error in fetching cuisines", "error", "long");
          setHasMore(false);
          return;
        }
        setCursor({
          c_id: data[data?.length - 1]?.c_id,
          created_at: data[data?.length - 1]?.created_at,
        });
        setCuisines(data);
        if (!data || data.length < pageSize) setHasMore(false);
        else setHasMore(true);
      } catch (error) {
        toast.error("Failed to fetch cuisines: " + error.message);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCuisine();
  }, []);

  const [updateLoading, setUpdateLoading] = useState(false);
  const handleSave = async (cuisine) => {
    if (updateLoading) return;
    setUpdateLoading(true);
    try {
      let savedCuisine;
      let imageUrl = cuisine?.image;

      // If image is a File, upload it and get the URL

      if (cuisine.image && cuisine.image instanceof File) {
        // You need to implement uploadImage to your backend or storage (e.g., Firebase, S3)
        const url = await uploadImageToSupabase(
          cuisine?.image,
          session?.user?.id
        );

        if (!url) {
          showToast("Unable to upload the image", "error", "long");
          return;
        }
        imageUrl = url;
      }

      const cuisineToSave = {
        ...cuisine,
        image_url: imageUrl, // Use the uploaded or existing image URL
      };


      if (cuisine?.c_id) {
        const {data,error,success} = await updateCuisine(cuisineToSave, session?.user?.id);
        if(!error || success) {
          console.error(error);
          showToast("Error in updating cuisine","error","long");
          return;
        }

        savedCuisine = data;

        showToast("Cuisine updated successfully", "success", "error");
      } else {
        const {data,error,success} = await insertCuisine(cuisineToSave, session?.user?.id);
        if(error || !success) {
          console.error(error);
          showToast("Error in saving cuisine","error", "long");
          return;
        }

        showToast("Cuisine added successfully", "success", "long");

        savedCuisine = data;
      }

      console.log("saved cuisine",savedCuisine);
      setCuisines((prev) => {
        if (cuisine?.c_id) {
          return prev.map((c) => (c.c_id === cuisine.c_id ? savedCuisine : c));
        } else {
          return [...prev, savedCuisine[0]];
        }
      });

      setPopupOpen(false);
      setEditingCuisine(null);
    } catch (error) {
      toast.error("Failed to save cuisine: " + error.message);
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const [deleting, setDeleting] = useState(false);
  const handleDeleteCuisine = async (c_id) => {
    if (deleting) return;
    setDeleting(true);
    const toastId = toast.loading("Deleting");
    try {
      const { data, success, error } = await deleteCuisine(c_id);

      if (error || !success) {
        console.error(error);
        showToast("Error in deleting cuisine", "error", "long");
        return;
      }

      setCuisines((prev) => {
        return cuisines?.filter((cuisine) => cuisine?.c_id !== c_id);
      });
      showToast("Deleted Sucessfully", "success", "long");
    } catch (error) {
      console.error(error);
      showToast("Error in deleting cuisine", "error", "long");
    } finally {
      toast.dismiss(toastId);
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen p-6 w-full  mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">
        Cuisine Manager
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cuisines?.map((cuisine, index) => {
          const isLast = index === cuisines.length - 1;
          return (
            <div
              ref={isLast ? lastCuisineRef : null}
              key={cuisine?.c_id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              {/* Image Box */}
              <div className="relative h-40 w-full bg-gray-100">
                <img
                  src={cuisine?.image_url}
                  alt={cuisine?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name + Edit */}
              <div className="flex justify-between items-center px-4 py-3">
                {/* Cuisine Name on Left */}
                <h3 className="text-lg font-semibold text-black truncate max-w-[70%]">
                  {cuisine?.name}
                </h3>

                {/* Buttons on Right */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCuisine(cuisine);
                      setPopupOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-orange/10 text-orange hover:bg-orange/20 text-xs font-semibold rounded-md border border-orange-200 shadow"
                  >
                    <FaEdit className="text-sm" /> Edit
                  </button>

                  <button
                    onClick={() => {
                      setCuisineToDelete(cuisine?.c_id);
                      setDeleteModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 text-xs font-semibold rounded-md border border-red-200 shadow"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* Keywords */}
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(cuisine?.keywords) ? (
                    cuisine?.keywords.map((kw, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-orange/10 text-black rounded-full"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs px-2 py-1 bg-orange/10 text-black rounded-full">
                      {cuisine?.keywords}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition"
        onClick={() => {
          setEditingCuisine(null);
          setPopupOpen(true);
        }}
      >
        <FaPlus className="text-xl" />
      </button>

      {/* Popup Component */}
      {popupOpen && (
        <CuisinePopup
          cuisine={editingCuisine}
          onClose={() => setPopupOpen(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          await handleDeleteCuisine(cuisineToDelete);
          setDeleteModalOpen(false);
        }}
        loading={deleting}
      />

      {(updateLoading || deleting) && <TransparentLoader />}
    </div>
  );
};

export default CuisineManager;
