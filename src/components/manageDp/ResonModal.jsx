import React, { useRef, useState } from "react";
import useOnClickOutside from "../../hooks/useOnCllickOutside";

const ReasonModal = ({ open, onClose, onSubmit, action = "Reject" }) => {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim().length === 0) return;
    onSubmit(reason);
    setReason("");
  };

//   const ref = useRef(null);

//   useOnClickOutside(ref, () => {
//     onClose();
//   })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        // ref={ref}
      >
        <h2 className="text-lg font-bold mb-4 text-danger">{action} Delivery Partner</h2>
        <label className="block mb-2 font-medium">
          Reason for {action?.toLowerCase()}:
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:border-danger"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={`Enter reason for ${action.toLowerCase()}`}
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
            disabled={reason.trim().length === 0}
          >
            {action}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReasonModal;