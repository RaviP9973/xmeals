import React, { useState } from "react";
import { FaUserEdit, FaCheckCircle, FaBan,FaRegClock , } from "react-icons/fa";
import { FaDirections } from "react-icons/fa";
import ImageModal from "./ImageModal";
import { useNavigate } from "react-router-dom";

const VendorItem = ({ vendor }) => {
  // const [imageClicked , setImageClicked] = useState(false);
  const navigate = useNavigate();
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
    // google maps api
    console.log("Jump to address:", vendor.address);
  };

  return (
    <div className=" rounded-2xl  p-6 mb-6 bg-white shadow-xs hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 cursor-pointer"
        
      >
        <div className="flex flex-col sm:flex-row items-center gap-6"
        onClick={() => {
          navigate(`/vendorDetails/${vendor.id}`);
        }}
        >
          {/* <img
            src={vendor.image_url}
            className="w-24 h-24 bg-gray rounded-xl object-cover"
            alt=""
          /> */}
          <ImageModal
            src={vendor.image_url}
            className="w-24 h-24 bg-gray rounded-xl object-cover"
            alt=""
          />
          {/* Vendor Info */}
          <div className="space-y-1 text-dark">
            <h3 className="text-2xl font-semibold text-primary">{vendor.name}</h3>
            <div className="gird grid-cols-1 gap-x-8 gap-y-1 text-sm text-gray-dark">
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
              <p className="flex gap-1 items-center text-dark font-semibold">
                <span className="font-medium text-secondary">Timing:</span>{"From "} <FaRegClock  /> 
                {vendor.timing}
                {" To "} <FaRegClock  />
                {vendor.timing}
              </p> 
              
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row sm:flex-col flex-wrap gap-3">
          <button
            onClick={handleEdit}
            className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-sm font-medium rounded-lg border-2 border-gray-200 "
          >
            <FaUserEdit className="text-lg" /> Edit
          </button>
          <button
            onClick={handleApprove}
            className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-sm font-medium rounded-lg border-2 border-gray-200 "
          >
            <FaCheckCircle className="text-lg" /> Approve
          </button>
          <button
            onClick={handleReject}
            className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-sm font-medium rounded-lg border-2 border-gray-200 ">
            <FaBan className="text-lg" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorItem;
