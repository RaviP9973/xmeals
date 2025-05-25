import React, { useState } from "react";
import { FaUserEdit, FaCheckCircle, FaBan, FaRegClock, FaPhoneAlt } from "react-icons/fa";
import { FaDirections } from "react-icons/fa";
import ImageModal from "./ImageModal";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import { MdLocalPhone, MdOutlinePermIdentity, MdOutlinePlace, MdPlace, MdTimelapse } from "react-icons/md";

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ">
        <div
          className="flex flex-col sm:flex-row items-center gap-6"
          // onClick={() => {
          //   navigate(`/vendorDetails/${vendor.id}`);
          // }}
        >
          {/* <img
            src={vendor.image_url}
            className="w-24 h-24 bg-gray rounded-xl object-cover"
            alt=""
          /> */}
          <ImageSlider images={vendor.image_url} />
          {/* <ImageModal
            src={vendor.image_url}
            className="w-24 h-24 bg-gray rounded-xl object-cover"
            alt=""
            onClick={(e) => {
              // setImageClicked(true);
              e.stopPropagation();
            }}
          /> */}
          {/* Vendor Info */}
          <div className="space-y-1 text-dark ">
            <h3 className="text-2xl font-semibold text-primary">
              {vendor.name}
            </h3>
            <div className="gird grid-cols-1 gap-x-8 text-sm text-gray-dark space-y-1">
              <p className="font-medium text-secondary flex gap-1 items-center ">

                <MdOutlinePermIdentity className="text-lg   text-black/80" />{" "}
                {vendor.name}{" "}
                
              </p>

              <p className="font-medium text-secondary flex gap-1 items-center ">
                <MdLocalPhone  className="text-lg  text-black/80" />

                {" "}
                {vendor.number}
                
              </p>
              <p 
                 className="font-medium text-secondary flex gap-1 items-center "><MdOutlinePlace  className="text-lg  text-black/80" />
                {vendor.address}

                <button
                  className="flex gap-1 items-center justify-center cursor-pointer hover:underline text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToTheAddress();
                  }}
                >
                  <FaDirections className="text-lg "/> 
                </button>
              </p>
              <p  className="font-medium text-secondary flex gap-1 items-center "><MdTimelapse className="text-lg  text-black/80" />
                {vendor.timing}
                {" - "}
                {vendor.timing}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row sm:flex-col flex-wrap gap-3">
          <button
            onClick={handleEdit}
            aria-label="Edit"
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-semibold rounded-lg border border-blue-200 shadow-sm"
          >
            <FaUserEdit className="text-lg" /> Edit
          </button>
          <button
            onClick={handleApprove}
            aria-label="Approve"
            className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success hover:bg-success/20 transition-all text-sm font-semibold rounded-lg border border-green-200 shadow-sm"
          >
            <FaCheckCircle className="text-lg" /> Approve
          </button>
          <button
            onClick={handleReject}
            aria-label="Reject"
            className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger hover:bg-danger/20 transition-all text-sm font-semibold rounded-lg border border-red-200 shadow-sm"
          >
            <FaBan className="text-lg" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorItem;
