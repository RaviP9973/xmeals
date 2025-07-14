import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./authContext";
import { aproveDp, blockDp, rejectDp, unBlockDp } from "../utils/delivery";
import { useToast } from "../components/customtoast/CustomToast";

const DpContext = createContext();

export const DpProvider = ({ children }) => {
  const { session } = useAuth();
  const { showToast } = useToast();
  const [dps, setDps] = useState([]);

  const handleAproveDp = async (dp_id) => {
    const toastId = toast.loading("Approving...");
    try {
      const { data, success, error } = await aproveDp(dp_id, session?.user?.id);
      if (!success || error) {
        showToast(
          "Error while approving the delivery partner",
          "error",
          "long"
        );
        console.error(error);
        return;
      }
      showToast("Delivery Partner approved", "success", "long");
      setDps((prev) => prev.filter((d) => d.dp_id !== dp_id));
    } catch (error) {
      showToast("Error while approving the delivery partner", "error", "long");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleRejectDp = async (dp_id, reason = "Rejected by admin") => {
    const toastId = toast.loading("Rejecting...");
    try {
      const { data, success, error } = await rejectDp(dp_id, session?.user?.id);
      if (!success || error) {
        showToast(
          "Error while rejecting the delivery partner",
          "error",
          "long"
        );
        console.error(error);
        return;
      }
      showToast("Delivery Partner rejected", "success", "long");
      setDps((prev) => prev.filter((d) => d.dp_id !== dp_id));
    } catch (error) {
      showToast("Error while rejecting the delivery partner", "error", "long");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUnBlockDp = async (dp_id) => {
    const toastId = toast.loading("Unblocking...");
    try {
      const { data, success, error } = await unBlockDp(
        dp_id,
        session?.user?.id
      );
      if (!success || error) {
        showToast("Error while blocking the delivery partner", "error", "long");
        console.error(error);
        return;
      }
      showToast("Delivery Partner blocked", "success", "long");
      setDps((prev) => prev.filter((d) => d.dp_id !== dp_id));
    } catch (error) {
      showToast("Error while blocking the delivery partner", "error", "long");
    } finally {
      toast.dismiss(toastId);
    }
  };
  const handleBlockDp = async (dp_id, reason = "Blocked by admin") => {
    const toastId = toast.loading("Blocking...");
    try {
      const { data, success, error } = await blockDp(dp_id, session?.user?.id);
      if (!success || error) {
        showToast(
          "Error while unblocking the delivery partner",
          "error",
          "long"
        );
        console.error(error);
        return;
      }
      showToast("Delivery Partner unblocked", "success", "long");
      setDps((prev) => prev.filter((d) => d.dp_id !== dp_id));
    } catch (error) {
      showToast("Error while unblocking the delivery partner", "error", "long");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const value = {
    dps,
    setDps,
    handleAproveDp,
    handleRejectDp,
    handleBlockDp,
    handleUnBlockDp,
  };
  return <DpContext.Provider value={value}>{children}</DpContext.Provider>;
};

export const useDp = () => useContext(DpContext);
