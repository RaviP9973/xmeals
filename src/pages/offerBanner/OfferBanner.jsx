import React, { useEffect, useState } from "react";
import AddOfferModal from "../../components/offer/AddOfferModal";
import { FaPlus } from "react-icons/fa";
import {
  deleteBanner,
  fetchAllOffers,
  updateOfferBanner,
  uploadImageAndInsertOffer,
  uploadOfferImageAndGetPublicUrl,
} from "../../utils/offer";
import toast from "react-hot-toast";
// import { useToast } from "../../components/customtoast/CustomToast";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { useToast } from "../../components/customtoast/CustomToast";
import SkeletonOfferBannerList from "../../components/skeltons/SkeltonOfferBannerList";

const OfferBannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await fetchAllOffers();
        if (!success || error) {
          // console.log(data);
          setBanners([]);
          showToast("Error while fetching banners", "error", "long");
          console.error(error);
          return;
        }

        setBanners(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleAddOffer = async ({ image, link }) => {
    try {
      const { data, success, error } = await uploadImageAndInsertOffer({
        image,
        link,
      });

      if (error) {
        console.log(error);
        showToast("Error while adding offer", "error", "long");
        return;
      }

      if (Array.isArray(data)) {
        setBanners((prev) => [...data, ...prev]);
      }

      showToast("Offer added successfully","success","long")
      
    } catch (error) {
      console.error(error);
      showToast("Error while adding offer", "error", "long");
    }
  };

  const handleEditOffer = async (data) => {
    try {
      const { image, link } = data;
      let image_url = editingBanner?.image_url;

      const linkToUpload = link || editingBanner?.link;
      if (image) {
        const data = await uploadOfferImageAndGetPublicUrl(image);

        if (!data) {
          // toast.error("Error in uploading image" );
          throw new Error("Error in uploading image");
        }
        image_url = data;
      }

      console.log("going for inserting data into table ");

      const { success, error } = await updateOfferBanner(
        image_url,
        linkToUpload,
        editingBanner?.id
      );

      if (error) {
        throw error;
      }
      // if (!error) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id ? { ...b, link, image_url } : b
        )
      );
      showToast("Banner updated", "success", "long");

      setEditingBanner(null);
    } catch (error) {
      console.error(error);
      showToast("Error in editing", "error", "long");
    }
  };

  const [deleting,setDeleting] = useState(false);
  const handleDeleteBanner = async (banner) => {
    try {
      setDeleting(true);
      const { error, success } = await deleteBanner(banner?.id);

      if (error) {
        throw error;
      }

      if (success) {
        setBanners((prev) => prev.filter((b) => b.id !== banner.id));
        showToast("Banner deleted", "success", "long");
      }
    } catch (error) {
      showToast("Error in Deleting image", "error", "long");
      console.error(error);
    }finally{
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-[80%] mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-orange-600 tracking-tight">
            Offer Banners
          </h2>
          {/* </div> */}
        </div>
        <hr className="mb-8 border-orange-200" />

        {loading ? (
          <SkeletonOfferBannerList />
        ) : banners.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-lg">
            No offer banners found.
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {banners?.map((banner) => (
              <div
                key={banner?.id}
                className="bg-white rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition p-4 flex flex-col items-center"
              >
                {banner?.image_url ? (
                  <img
                    src={banner?.image_url}
                    alt="Offer Banner"
                    className="w-full h-40 object-cover rounded-xl mb-4 border"
                    style={{ aspectRatio: "3/1" }}
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400 mb-4 border">
                    No Image
                  </div>
                )}
                <div className="w-full">
                  <p className="text-xs text-gray-400 mb-1">
                    Created: {new Date(banner?.created_at).toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    {banner?.link ? (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm truncate max-w-[60%]"
                        title={banner.link}
                        style={{
                          display: "inline-block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          verticalAlign: "middle",
                        }}
                      >
                        {banner.link}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm max-w-[60%] truncate">
                        No link
                      </span>
                    )}
                    <div className="flex gap-2 ml-auto">
                      <button
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 text-xs font-semibold border border-orange-200"
                        onClick={() => {
                          setEditingBanner(banner);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs font-semibold border border-red-200"
                        onClick={() => {
                          setOfferToDelete(banner);
                          setDeleteModalOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Floating Add Button */}
        <button
          className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <FaPlus className="text-xl" />
        </button>

        <AddOfferModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
          }}
          onAdd={editingBanner ? handleEditOffer : handleAddOffer}
          editingBanner={editingBanner}
        />
      </div>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          await handleDeleteBanner(offerToDelete);
          setDeleteModalOpen(false);
        }}
        loading={deleting}
      />
    </div>
  );
};

export default OfferBannerList;
