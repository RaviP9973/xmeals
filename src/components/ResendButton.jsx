import React, { useEffect, useState } from "react";
import { handleAuthError, sendOtp } from "../utils/auth";
import { toast } from "react-toastify";
import { useToast } from "./customtoast/CustomToast";

function ResendButton({ fullPhone,setIsResending,onResendSuccess ,isResending}) {
  const [timer, setTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);
  const [isResent, setIsResent] = useState(false);
   const { showToast } = useToast()
  // Countdown logic
  useEffect(() => {
    if (timer === 0) {
      setShowResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async (e) => {
    // 👇 Add actual resend logic here
      e.preventDefault();
      e.stopPropagation();

      setIsResending(true);
    const toastId = toast.loading("sending OTP...");
    try {
      const res = await sendOtp(fullPhone);
      toast.dismiss();
      setTimer(30);
      setShowResend(false);
      onResendSuccess && onResendSuccess();
      setIsResent(true);
    } catch (error) {
      toast.dismiss(toastId);
      // handleAuthError(error);
      showToast(error.message, "error", "short")
    }finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mt-4 text-sm text-slate-700">
      {showResend ? (
        <div className="flex items-center gap-1">
          <span>Didn't receive OTP?</span>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-orange font-semibold hover:underline cursor-pointer"
          >
            Resend OTP
          </button>
        </div>
      ) : (
        <div>
         {isResent && <p className="text-green">Resent Successfully!!</p>} 
          <p>
          Resend OTP in: <span className="font-medium">{timer}s</span>
        </p>
        </div>
      )}
    </div>
  );
}

export default ResendButton;