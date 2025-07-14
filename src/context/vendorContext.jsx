import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { blockVendor, rejectVendor, unblockVendor } from "../utils/vendor";
import { useAuth } from "./authContext";
import { useToast } from "../components/customtoast/CustomToast";
// import { useToast } from "../components/customtoast/CustomToast";

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const { session } = useAuth();
  const [vendorId, setVendorId] = useState(null);
  const [comment, setComment] = useState("");
  const [vendors, setVendors] = useState([]);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchedVendors, setsearchedVendors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState("");
  const handleBlockVendor = async (v_id) => {
    try {
      setLoading(true);
      const { data, error, success } = await blockVendor(
        v_id,
        session?.user?.id
      );
      if (error || !success) {
        console.error(error);
        showToast("Error blocking vendor", "error", "long");
        return false;
      }
      showToast("Vendor Blocked", "success", "long");
      // Remove vendor from list
      setVendors((prev) => prev.filter((v) => v.v_id !== v_id));
      return true;
    } catch (error) {
      showToast("Error blocking vendor", "error", "long");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUnBlock = async (v_id) => {
    try {
      setLoading(true);
      const { data, error, success } = await unblockVendor(
        v_id,
        session?.user?.id
      );
      if (error || !success) {
        console.error(error);
        showToast("Error in unblocking vendor", "error", "long");
        return false;
      }
      showToast("Vendor Unblocked", "success", "long");
      // Remove vendor from list
      setVendors((prev) => prev.filter((v) => v.v_id !== v_id));
      return true;
    } catch (error) {
      showToast("Error unblocking vendor", "error", "long");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const toastId = toast.loading("Loading...");
    try {
      setLoading(true);
      if (!session || !session?.user?.id) {
        showToast("User is not authenticated", "error", "long");
        return;
      }
      if (!vendorId || !comment.length) {
        showToast("Vendor Id and comment is required", "error", "long");

        return;
      }

      const { data, success, error } = await rejectVendor(
        vendorId,
        session?.user?.id,
        comment
      );

      if (!success || error) {
        console.error(error);
        showToast("Error while aproving the vendor", "error", "long");
        return;
      }

      showToast("Venor rejected successfully", "error", "long");
    } catch (error) {
      console.error(error);
      showToast("Error while aproving the vendor", "error", "long");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  const value = {
    handleReject,
    handleBlockVendor,
    handleUnBlock,
    vendorId,
    setVendorId,
    comment,
    setComment,
    vendors,
    setVendors,
    loading,
    setLoading,
    searchedVendors, setsearchedVendors,
    searchQuery, setSearchQuery,
    searchLoading, setSearchLoading
  };
  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
};

export const useVendor = () => useContext(VendorContext);
