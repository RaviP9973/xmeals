import React from "react";

const ConfirmDeleteModal = ({ open, onClose, onConfirm, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
        <h3 className="text-lg font-bold mb-4 text-red-600">Are you sure?</h3>
        <p className="mb-6 text-gray-700">Do you really want to delete this cuisine? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-semibold"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;