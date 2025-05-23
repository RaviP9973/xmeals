import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaUserSlash,
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";


const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          className="w-full py-3 px-6 bg-primary hover:bg-[#0056b3] text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2 "
          onClick={() => navigate("/admin/vendor")}
        >
          <FaUserCheck /> Existing Vendors
        </button>
        <button
          className="w-full py-3 px-6 bg-gray hover:bg-[#5a6268] text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
          onClick={() =>
            navigate("/admin/vendor", {
              state: { defaultTab: "requests" },
            })
          }
        >
          <FaUserClock/> Vendor Requests
        </button>

        <button className="w-full py-3 px-6 bg-[#28a745] hover:bg-[#218838] text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2">
          <CiDeliveryTruck className="text-lg font-bold"/> Orders (Not Yet Delivered)
        </button>

        <button className="w-full py-3 px-6 bg-[#17a2b8] hover:bg-[#138496] text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
          onClick={() => {
            navigate("/manageDp")
          }}
        >
          <MdManageAccounts/> Manage Delivery Partners
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
