import React, { useState } from "react";
import { useVendor } from "../../context/vendorContext";

const RejectCommentModal = ({ open, onClose }) => {
  const {comment, setComment,handleReject} = useVendor();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim().length === 0) return;
    await handleReject();
    setComment("");
  };


  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
      >
        <h2 className="text-lg font-bold mb-4 text-danger">Reject Vendor</h2>
        <label className="block mb-2 font-medium">Reason for rejection:</label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:border-danger"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter reason for rejection"
          required
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-danger text-white hover:bg-danger/90"
            disabled={comment.trim().length === 0}
          >
            Reject
          </button>
        </div>
      </form>
    </div>
  );
};

export default RejectCommentModal;