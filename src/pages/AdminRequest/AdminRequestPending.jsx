import React from "react";
import { FaHourglassHalf, FaUserShield } from "react-icons/fa";

const AdminRequestPending = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-orange-100">
    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-md">
      <FaUserShield className="text-6xl text-orange-500 mb-4 animate-bounce" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Request Pending</h1>
      <FaHourglassHalf className="text-4xl text-blue-400 mb-4 animate-pulse" />
      <p className="text-lg text-gray-600 text-center mb-4">
        Your request to become an <span className="text-primary font-semibold">Admin</span> is under review.<br />
        You will be notified once your access is approved by the super admin.
      </p>
      {/* <div className="w-full flex justify-center">
        <button
          className="mt-2 px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-orange-600 transition"
          onClick={() => window.location.href = "/"}
        >
          Back to Home
        </button>
      </div> */}
    </div>
  </div>
);

export default AdminRequestPending;