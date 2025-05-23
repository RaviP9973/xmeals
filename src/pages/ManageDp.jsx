import React, { useState } from "react";
import { FaCheckCircle, FaBan, FaTimes, FaPlus, FaIdCard, FaUserCheck, FaUserClock, FaUserSlash } from "react-icons/fa";
import ImageModal from "../components/ImageModal";

const tabs = [
  { id: "existing", label: "Existing", icon: <FaUserCheck /> },
  { id: "requests", label: "Requests" ,icon: <FaUserClock />},
  { id: "blocked", label: "Blocked", icon: <FaUserSlash /> },
];

const ManageDp = () => {
  const [activeTab, setActiveTab] = useState("existing");


  const handleAddNewVendor = () => {
    // add new vendor
    console.log("Added new vendor");
  }

  const handleAprove = () => {

  }

  const handleReject = () => {
  }

  const handleBlock = () => {

  }

  return (
    <div className="min-h-screen mx-auto p-6 animate-fade-in bg-gray-100 max-w-3/4">
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300
          ${
            activeTab === tab.id
              ? "bg-primary text-white shadow-md scale-[1.02]"
              : "bg-light text-gray-dark hover:bg-[#e2e6ea]"
          }`}
          >
            {tab.icon}
            <span className="text-sm sm:text-base">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Vendor List Placeholder */}
      {/* <div className="bg-light border rounded-xl p-4 mb-6 shadow-inner min-h-[100px] flex items-center justify-center text-gray">
        Vendor List Placeholder
      </div> */}

      {/* Detailed Vendor Card */}
      <div className="bg-white  rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-transform duration-300">
        {/* Left Side - Image and Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* <div className="w-24 h-24 bg-gray rounded-xl"></div> */}
          <ImageModal
            src={'https://placehold.co/600x400'}
            className="w-24 h-24 bg-gray rounded-xl object-cover"
            alt=""
          />
          <div className="space-y-1 text-dark">
            <p><span className="font-semibold">Name:</span> John Doe</p>
            <p><span className="font-semibold">DOB:</span> 01/01/1980</p>
            <p><span className="font-semibold">Address:</span> 123 Main Street</p>
            <button className="mt-2 px-4 py-2 flex items-center gap-2 bg-info hover:bg-cyan text-white rounded-lg text-sm font-medium transition">
              <FaIdCard /> ID Card
            </button>
          </div>
        </div>

        {/* Right Side - Status and Actions */}
        <div className="space-y-2 text-right ">
          <p className="text-dark font-medium">Status: Pending</p>
          <p className="text-gray text-sm">Orders with him: 3</p>
          <div className="flex flex-wrap justify-between gap-2 pt-2">
            <button className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-sm font-medium rounded-lg border-2 border-gray-200 "
                onClick={handleAprove}
            >
              <FaCheckCircle /> Approve
            </button>
            <button className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-sm font-medium rounded-lg border-2 border-gray-200 "
            onClick={handleReject}
            >
              <FaTimes /> Reject
            </button>
            <button className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-sm font-medium rounded-lg border-2 border-gray-200 "
            onClick={handleBlock}
            >
              <FaBan /> Block
            </button>
          </div>
        </div>
      </div>

      {/* Add New Vendor Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110"
      onClick={handleAddNewVendor}
      >
        <FaPlus className="text-xl" />
      </button>
    </div>
  );
};

export default ManageDp;