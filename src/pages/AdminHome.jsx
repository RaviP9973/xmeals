import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaUserSlash,
} from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";

import { MdManageAccounts } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { ImSpoonKnife } from "react-icons/im";
import { logout } from "../utils/auth";
import { useAuth } from "../context/authContext";
import { GoGraph } from "react-icons/go";
import SupportModal from "../components/modals/SupportModal";


const AdminHome = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8 ">
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
          <FaUserClock /> Vendor Requests
        </button>

        <button
          className="w-full py-3 px-6 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FaUserClock /> Manage Support Team
        </button>
        {isModalOpen && <SupportModal onClose={() => setIsModalOpen(false)} />}

        <button className="w-full py-3 px-6 bg-red hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
          onClick={() => {
            navigate('/login_otp_banner')
          }}
        >
          <CiDeliveryTruck className="text-lg font-bold" /> Login/Otp Banner
        </button>

        <button className="w-full py-3 px-6 bg-[#28a745] hover:bg-[#218838] text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
          onClick={() => {
            navigate('/orders')
          }}
        >
          <CiDeliveryTruck className="text-lg font-bold" /> Orders (Not Yet
          Delivered)
        </button>

        <button
          className="w-full py-3 px-6 bg-[#17a2b8] hover:bg-[#138496] text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
          onClick={() => {
            navigate("/manageDp");
          }}
        >
          <MdManageAccounts /> Manage Delivery Partners
        </button>

        <button
          className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
          onClick={() => navigate("/admin/cuisines")}
        >
          <ImSpoonKnife /> Manage Cuisine
        </button>
        <button
          className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
          onClick={() => navigate("/offers")}
        >
          <BiSolidOffer /> Manage Offers
        </button>

        <button
          onClick={async () => {
            navigate('/dashboard')
          }}
          className="w-full py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
        >
          <GoGraph className="font-semibold text-lg" /> Dashboard
        </button>


        <button
          onClick={async () => {
            await logout(setSession);
          }}
          className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center gap-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
