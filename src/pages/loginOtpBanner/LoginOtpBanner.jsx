import React, { useState, useEffect } from "react";
import { Trash2, Plus, Edit3, Eye, X, Check } from "lucide-react";
import {
  getAllBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  getImageUrl,
  hasValidImages,
  uploadBannerImage,
  hasValidLink,
} from "../../utils/loginOtpBanner";
import { useToast } from "../../components/customtoast/CustomToast";
import Loader from "../../components/Loader";

const LoginOtpBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // replaces deleteModal
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    mobile_image_url: "",
    pc_image_url: "",
    link: "",
  });

  // Fetch banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const result = await getAllBanners();

      if (result.success) {
        setBanners(result.data || []);
      } else {
        setError("Failed to fetch banners");
        console.error("Error fetching banners:", result.error);
      }
    } catch (err) {
      setError("Error loading banners");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.mobile_image_url && !formData.pc_image_url) {
      setError("Please provide at least one image URL");
      return;
    }

    try {
      setLoading(true);
      let result;

      if (editingBanner) {
        result = await updateBanner(editingBanner.id, formData);
      } else {
        result = await addBanner(formData);
      }

      if (result.success) {
        showToast("Banner added successfully", "success", "short");
        await fetchBanners();
        resetForm();
        setError("");
      } else {
        setError(
          editingBanner ? "Failed to update banner" : "Failed to add banner"
        );
        console.error("Error:", result.error);
      }
    } catch (err) {
      setError("Error saving banner");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await deleteBanner(id);

      if (result.success) {
        showToast("Banner deleted successfully", "success", "short");
        await fetchBanners();
        setError("");
      } else {
        setError("Failed to delete banner");
        console.error("Error deleting banner:", result.error);
      }
    } catch (err) {
      setError("Error deleting banner");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      mobile_image_url: banner.mobile_image_url || "",
      pc_image_url: banner.pc_image_url || "",
      link: banner.link || "",
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      mobile_image_url: "",
      pc_image_url: "",
      link: "",
    });
    setShowAddForm(false);
    setEditingBanner(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e, targetField) => {
    const file = e.target.files[0];
    if (!file) return;

    const result = await uploadBannerImage(file);
    if (result.success) {
      setFormData((prev) => ({
        ...prev,
        [targetField]: result.url,
      }));
      setError("");
    } else {
      console.error(result.error);
      setError("Failed to upload image");
    }
  };

  if (loading && banners.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Banner
        </button>
      </div>

      {error && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 lg:p-8 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-semibold text-orange-600">
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 pt-6">
              {/* Image Upload Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Image
                  </label>

                  <label className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md cursor-pointer hover:bg-orange-700 transition">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "mobile_image_url")}
                      className="hidden"
                    />
                  </label>

                  {formData.mobile_image_url && (
                    <img
                      src={formData.mobile_image_url}
                      alt="Mobile Preview"
                      className="mt-3 h-24 w-full object-fill rounded "
                    />
                  )}
                </div>

                {/* PC Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PC Image
                  </label>

                  <label className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md cursor-pointer hover:bg-orange-700 transition">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "pc_image_url")}
                      className="hidden"
                    />
                  </label>

                  {formData.pc_image_url && (
                    <img
                      src={formData.pc_image_url}
                      alt="PC Preview"
                      className="mt-3 h-24 w-full object-fill rounded "
                    />
                  )}
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="https://example.com"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {editingBanner ? "Update Banner" : "Add Banner"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner List */}
      <div className="grid gap-6">
        {banners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No banners found</p>
            <p className="text-gray-400">
              Click "Add New Banner" to create your first banner
            </p>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div key={banner.id} className="bg-white rounded-lg shadow-md p-6 ">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Banner {index + 1}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(banner.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(banner)}
                    className="text-orange hover:text-orange-800 p-2 rounded-md hover:bg-orange-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm  px-4">
                  <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-orange">
                        Confirm Delete
                      </h2>
                      <button
                        onClick={() => setDeleteTarget(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <p className="text-gray-700 mb-6">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-gray-900">
                        Banner {banners.indexOf(deleteTarget) + 1}
                      </span>
                      ?
                    </p>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setDeleteTarget(null)}
                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await handleDelete(deleteTarget.id);
                          setDeleteTarget(null);
                        }}
                        className="px-4 py-2 rounded-md bg-orange hover:bg-orange-700 text-white transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {/* Mobile Image */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Mobile Image</h4>
                  {banner.mobile_image_url && (
                    <div className="border border-gray-200 rounded-lg p-1">
                      <img
                        src={banner.mobile_image_url}
                        alt="Mobile banner"
                        className="w-full h-32 object-fill rounded-md"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* PC Image */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">PC Image</h4>
                  {banner.pc_image_url && (
                    <div className="border border-gray-300 rounded-lg p-1">
                      <img
                        src={banner.pc_image_url}
                        alt="PC banner"
                        className="w-full h-32 object-fill rounded-md"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Link */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Link</h4>
                {hasValidLink(banner) ? (
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-gray-500" />
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {banner.link}
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No link provided</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoginOtpBanner;
