import React, { useState, forwardRef } from "react";
import {
  FaUserEdit,
  FaCheckCircle,
  FaBan,
  FaRegClock,
  FaPhoneAlt,
} from "react-icons/fa";
import { FaDirections } from "react-icons/fa";
// import ImageModal from "./ImageModal";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import {
  MdLocalPhone,
  MdOutlinePermIdentity,
  MdOutlinePlace,
  MdOutlineWatchLater,
  MdPlace,
  MdTimelapse,
} from "react-icons/md";
import { toast } from "react-toastify";
import { useToast } from "./customtoast/CustomToast";
import {
  aproveVendor,
  blockVendor,
  handleEditVendor,
  rejectVendor,
} from "../utils/vendor";
import { useAuth } from "../context/authContext";
import { useVendor } from "../context/vendorContext";
import TransparentLoader from "./TransparentLoader";

const VendorItem = forwardRef(
  ({ vendor, setShowRejectModal, loadingMore, activeTab }, ref) => {
    // const [imageClicked , setImageClicked] = useState(false);
    const navigate = useNavigate();
    const handleEdit = async (v_id, session) => {
      // Handle edit action
      //open vendors app with current user as vendor
      const toastId = toast.loading("loading...");
      try {
        console.log("yaha to aa rha hu ");
        const { data, success, error } = await handleEditVendor(
          v_id,
          "NA",
          session
        );

        if (!success || error) {
          console.error(error);
          return;
        }

        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        toast.dismiss(toastId);
      }
      console.log("Edit vendor:", vendor);
    };

    const {
      setVendorId,
      handleBlockVendor,
      handleUnBlock,
      setVendors,
      loading,
      setLoading,
    } = useVendor();
    const { showToast } = useToast();
    const { session } = useAuth();

    const handleAprove = async (v_id) => {
      const toastId = toast.loading("Approving...");
      try {
        setLoading(true);
        const { data, success, error } = await aproveVendor(
          v_id,
          session?.user?.id
        );

        if (!success || error) {
          console.error(error);
          showToast("Error while aproving the vendor", "error", "long");
          return;
        }

        showToast("Venor aproved", "success", "long");
        setVendors((prev) => prev.map((v) => v.v_id !== v_id ? v : { ...v, status: "verified" }));
      } catch (error) {
        console.error(error);
        showToast("Error while aproving the vendor", "error", "long");
      } finally {
        toast.dismiss(toastId);
        setLoading(false);
      }
    };

    const jumpToTheAddress = () => {
      // Handle address action
      // google maps api
      console.log("Jump to address:", vendor.address);
    };

    const formatAddressLines = (vendor) => {
      const { street, city, state, pincode } = vendor;
      const lines = [street, city, state, pincode]
        ?.filter((line) => line && line !== "NA")
        .join(",");
      return lines;
    };

    // const handleBlock = async (v_id) => {
    //   try {
    //     const {data,error,success} = await blockVendor(v_id,session?.user?.id);

    //     if(error || !success){
    //       throw error;
    //     }

    //     showToast("Vendor Blocked");
    //     //remove vendor from vendors

    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      // If already in 12hr format, just return
      if (
        timeStr.toLowerCase().includes("am") ||
        timeStr.toLowerCase().includes("pm")
      )
        return timeStr;
      // Assume timeStr is "HH:mm" (24hr)
      const [hour, minute] = timeStr.split(":");
      const date = new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    return (
      <div
        className=" rounded-2xl  p-6 mb-6 bg-white shadow-xs hover:shadow-lg transition-shadow duration-300"
        ref={ref}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ImageSlider images={[vendor?.banner_url]} />

            {/* Vendor Info */}
            <div className="space-y-1 text-dark ">
              <h3 className="text-2xl font-semibold text-primary truncate max-w-[640px]">
                {vendor?.shop_name}
              </h3>
              <div className="gird grid-cols-1 gap-x-8 text-sm text-gray-dark space-y-1">
                <p className="font-medium text-secondary flex gap-1 items-center ">
                  <MdOutlinePermIdentity className="text-lg   text-black/80 truncate max-w-[220px]" />{" "}
                  {vendor?.v_name}{" "}
                </p>

                <p className="font-medium text-secondary flex gap-1 items-center ">
                  <MdLocalPhone className="text-lg  text-black/80" />{" "}
                  {vendor?.mobile_number}
                </p>
                <p className="font-medium text-secondary flex gap-1 items-center ">
                  <MdOutlinePlace className="text-lg  text-black/80 truncate max-w-[240px]" />
                  {formatAddressLines(vendor)}

                  <button
                    className="flex gap-1 items-center justify-center cursor-pointer hover:underline text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      jumpToTheAddress();
                    }}
                  >
                    <FaDirections className="text-lg " />
                  </button>
                </p>
                <p className="font-medium text-secondary flex gap-1 items-center ">
                  <MdTimelapse className="text-lg text-black/80" />
                  {/* Shift 1 */}
                  {vendor?.shift1_opening_time &&
                    vendor?.shift1_closing_time && (
                      <>
                        <span>
                          {formatTime(vendor?.shift1_opening_time)} -{" "}
                          {formatTime(vendor?.shift1_closing_time)}
                        </span>
                      </>
                    )}
                  {/* Shift 2 */}
                  {vendor?.shift2_opening_time &&
                    vendor?.shift2_closing_time && (
                      <>
                        <span className="mx-2 text-gray-400">|</span>
                        <span>
                          {formatTime(vendor?.shift2_opening_time)} -{" "}
                          {formatTime(vendor?.shift2_closing_time)}
                        </span>
                      </>
                    )}
                </p>
                <p className="font-medium text-secondary flex gap-1 items-center">
                  <MdOutlineWatchLater className="text-lg text-black/80" />
                  {new Date(vendor.created_at).toLocaleString()}
                </p>

                <p className="font-medium text-secondary flex gap-1 items-center">
                  Status: <span className="capitalize">{vendor?.status || "NA"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row sm:flex-col flex-wrap gap-3">
            <button
              onClick={() => {
                handleEdit(vendor?.v_id, session);
              }}
              aria-label="Edit"
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-semibold rounded-lg border border-blue-200 shadow-sm"
            >
              <FaUserEdit className="text-lg" /> Edit
            </button>

            {activeTab !== "existing" && (
              <button
                onClick={() => {
                  if (vendor?.status === "verified") {
                    showToast("Vendor is alreday verified", "success");
                    return;
                  }
                  handleAprove(vendor?.v_id);
                }}

                disabled={vendor?.status === "verified"}
                aria-label="Approve"
                className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success hover:bg-success/20 transition-all text-sm font-semibold rounded-lg border border-green-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCheckCircle className="text-lg" /> Approve
              </button>
            )}

            {activeTab !== "rejected" && (
              <button
                onClick={() => {
                  if (activeTab === "existing") {
                    //block krna h
                    handleBlockVendor(vendor?.v_id);
                  } else if (activeTab === "blocked") {
                    // already blocked h use unblock krna h
                    handleUnBlock(vendor?.v_id);
                  } else {
                    // reject krna h
                    setVendorId(vendor?.v_id);
                    setShowRejectModal(true);
                  }
                }}
                aria-label="Reject"
                className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger hover:bg-danger/20 transition-all text-sm font-semibold rounded-lg border border-red-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"

                disabled={activeTab === "requests" && vendor?.status === "rejected" || activeTab === "blocked" && vendor?.status === "verified" || activeTab === "existing" && vendor?.status === "blocked"}
              >
                <FaBan className="text-lg" />{" "}
                {activeTab === "existing"
                  ? "Block"
                  : activeTab === "blocked"
                    ? "Unblock"
                    : "Reject"}
              </button>
            )}
          </div>
        </div>

        {loading && <TransparentLoader />}

        {/* {
        loadingMore && (
          <CustomLoader />
        )
      } */}
      </div>
    );
  }
);

export default VendorItem;
