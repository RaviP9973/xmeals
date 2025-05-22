import React, { useState } from "react";
import { FaUserEdit, FaCheckCircle, FaBan } from "react-icons/fa";
import { FaDirections } from "react-icons/fa";
import ImageModal from "./ImageModal";

const VendorItem = ({ vendor }) => {

  const [imageClicked , setImageClicked] = useState(false);
  

  const handleEdit = () => {
    // Handle edit action
    //open vendors app with current user as vendor
    console.log("Edit vendor:", vendor);

  };

  const handleApprove = () => {
    // Handle approve action
    console.log("Approve vendor:", vendor);
  };

  const handleReject = () => {
    // Handle reject action
    console.log("Reject vendor:", vendor);
  };

  const jumpToTheAddress = () => {
    // Handle address action
    console.log("Jump to address:", vendor.address);
  };

  return (
    <div className=" rounded-2xl  p-6 mb-6 bg-white shadow-xs hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6"
          
        >
          {/* <img
            src={vendor.image_url}
            className="w-24 h-24 bg-gray rounded-xl object-cover"
            alt=""
          /> */}
          <ImageModal src={vendor.image_url}
            className="w-24 h-24 bg-gray rounded-xl object-cover"
            alt="" />
          {/* Vendor Info */}
          <div className="space-y-1 text-dark">
            <h3 className="text-2xl font-semibold text-dark">{vendor.name}</h3>
            <div className="grid grid-cols-1  gap-x-8 gap-y-1 text-sm text-gray-dark">
              <p>
                <span className="font-medium text-secondary">V-Name:</span>{" "}
                {vendor.vname}
              </p>
              <p>
                <span className="font-medium text-secondary">Phone:</span>{" "}
                {vendor.number}
              </p>
              <p className="flex gap-3">
                <span className="font-medium text-secondary">Address:</span>
                {vendor.address}

                <button
                  className="flex gap-1 items-center justify-center cursor-pointer hover:underline text-primary"
                  onClick={jumpToTheAddress}
                >
                  <FaDirections /> Directions
                </button>
              </p>
              <p>
                <span className="font-medium text-secondary">Timing:</span>{" "}
                {vendor.timing}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row sm:flex-col flex-wrap gap-3">
          <button
            onClick={handleEdit}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-success hover:bg-[#218838] text-white rounded-lg shadow-sm transition-all duration-200"
          >
            <FaUserEdit className="text-lg" /> Edit
          </button>
          <button
            onClick={handleApprove}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-info hover:bg-[#138496] text-white rounded-lg shadow-sm transition-all duration-200"
          >
            <FaCheckCircle className="text-lg" /> Approve
          </button>
          <button
            onClick={handleReject}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-danger hover:bg-[#c82333] text-white rounded-lg shadow-sm transition-all duration-200"
          >
            <FaBan className="text-lg" /> Reject
          </button>
        </div>
      </div>

      {/* <ImageModal src={"https://placehold.co/600x400"}/> */}
      
    </div>
  );
};

export default VendorItem;
