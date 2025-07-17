import React, { useState } from "react";

import {
  FaCheckCircle,
  FaBan,
  FaTimes,
  FaIdCard,
  FaDirections,
} from "react-icons/fa";
import { MdDateRange, MdOutlinePlace } from "react-icons/md";
import ImageSlider from "../ImageSlider";
import { MdOutlinePermIdentity } from "react-icons/md";
import { useDp } from "../../context/dpContext";
import {
  IoCheckmarkCircleSharp,
  IoBan,
  IoTime,
  IoCloseCircle,
} from "react-icons/io5";
// ...rest of imports...

const statusIconMap = {
  verified: {
    icon: <IoCheckmarkCircleSharp className="text-xl text-green-500" />,
    label: "Verified",
  },
  blocked: {
    icon: <IoBan className="text-xl text-blue-500" />,
    label: "Blocked",
  },
  rejected: {
    icon: <IoCloseCircle className="text-xl text-red-500" />,
    label: "Rejected",
  },
  pending: {
    icon: <IoTime className="text-xl text-yellow-500" />,
    label: "Pending",
  },
  // Add more statuses if needed
};

const DpCard = ({ dp, tab }) => {
  const { handleAproveDp, handleRejectDp, handleBlockDp ,handleUnBlockDp} = useDp();

  const [downloading,setDownloading]= useState(false);
  const downloadImage = async (url, fileName) => {
    setDownloading(true);
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloading(false)
  };

  // Get icon and label for current status
  const statusInfo = statusIconMap[dp?.status] || {
    icon: <IoTime className="text-xl text-gray-400" />,
    label: dp?.status === "not_verified" ? "Pending" : dp?.status,
  };

  return (
    <div className="bg-white  rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-transform duration-300 ">
      {/* Left Side - Image and Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <ImageSlider images={[dp?.photo_url]} />
        <div className="space-y-1 text-dark">
          <p className="font-medium text-secondary flex gap-1 items-center ">
            <MdOutlinePermIdentity className="text-lg   text-black/80" />{" "}
            {dp?.name}
          </p>
          <p className="font-medium text-secondary flex gap-1 items-center ">
            <MdDateRange className="text-lg   text-black/80" />
            {dp?.dob}
          </p>
          <p className="font-medium text-secondary flex gap-1 items-center ">
            <MdOutlinePlace className="text-lg  text-black/80" />
            {dp?.street},{" " + dp?.city}
            {/* <button
              className="flex gap-1 items-center justify-center cursor-pointer hover:underline text-primary"
              onClick={(e) => {
                e.stopPropagation();
                // jumpToTheAddress();
              }}
            >
              <FaDirections className="text-lg " />
            </button> */}
          </p>
          <button
            className="mt-2 px-4 py-2 flex items-center gap-2 bg-info hover:bg-cyan text-white rounded-lg text-sm font-medium transition cursor-pointer disabled:bg-info/50 disabled:hover:bg-cyan/50"
            disabled={downloading}
            onClick={() => {
              // console.log("kya mai cllick kr pa rha hu down id");
              dp?.id_url?.forEach((url, index) => {
                const fileName = `image_${index + 1}.${
                  url.split(".").pop().split("?")[0]
                }`; // get extension
                downloadImage(url, fileName);
              });
            }}
          >
            <FaIdCard /> ID Card
          </button>
        </div>
      </div>

      {/* Right Side - Status and Actions */}
      <div className="space-y-2 text-right ">
        <p className="text-dark font-medium flex items-center justify-end gap-2 capitalize">
          Status: {statusInfo.label}
          {statusInfo.icon}
        </p>

        {tab === "existing" && (
          <p className="text-black text-md">
            Orders with him:{" "}
            <span className="text-secondary">{dp?.total_orders}</span>
          </p>
        )}

        <div className="flex flex-wrap justify-between gap-2 pt-2">
          {tab !== "existing" && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 transition-all text-sm font-semibold rounded-lg border border-green-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleAproveDp(dp.dp_id)}
              aria-label="Approve"
              disabled={dp?.status === "verified"}
            >
              <FaCheckCircle className="text-lg" /> Approve
            </button>
          )}

          {/* Reject button: show except on 'rejected' tab */}
          {tab !== "rejected" && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-all text-sm font-semibold rounded-lg border border-yellow-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleRejectDp(dp.dp_id)}
              // aria-label="Reject"
              disabled={dp?.status === "rejected"}
            >
              <FaTimes className="text-lg" /> Reject
            </button>
          )}
          {/* Block/Unblock button: show 'Block' except on 'blocked' tab, show 'Unblock' only on 'blocked' tab */}
          {tab === "blocked" ? (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-sm font-semibold rounded-lg border border-blue-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed  "
              onClick={() => handleUnBlockDp(dp.dp_id)}
              aria-label="Block"
              disabled={dp?.status === "verified"}
            >
              <FaCheckCircle className="text-lg" /> Unblock
            </button>
          ) : (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 transition-all text-sm font-semibold rounded-lg border border-red-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleBlockDp(dp.dp_id)}
              // aria-label="Block"

              disabled={dp?.status === "blocked"}
            >
              <FaBan className="text-lg" /> Block
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DpCard;
