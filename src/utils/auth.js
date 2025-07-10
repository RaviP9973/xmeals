
import { toast } from "react-toastify";
import { supabase } from "../supabaseclient";
import { TABLES } from "../constants/DBSchema";



export const validateName = (name) => {
  const trimmedName = name.trim();
  if (!trimmedName.length) {
    // toast.error("Please enter your name — it can't be empty or just spaces.");
    return null;
  }
  return trimmedName;
};

export const validateOtp = (otp , showToast) => {
  if (!otp || otp.length !== 6) {
    // toast.error("Please enter a valid 6-digit OTP!");
    showToast("Please enter a valid 6-digit OTP!", "error", "short")
    return false;
  }
  return true;
};

export const sendOtp = async (fullPhone) => {
  const { data, error: otpError } = await supabase.auth.signInWithOtp({
    phone: fullPhone,
  });

  // console.error(otpError)
  if (otpError) {
    console.error("Error sending OTP: ", otpError);
    // toast.error("Failed to send OTP. Please try again.");
    throw new Error("Couldn't send OTP. Retry in a moment.");
  }
};
export const verifyOtp = async (phone, otpValue) => {
  try {
    const { data, error: otpError } = await supabase.auth.verifyOtp({
      phone,
      token: otpValue,
      type: "sms",
    });
    if (otpError) {
      throw new Error("Invalid OTP, please enter the correct OTP");
    }
    return data;
  } catch (error) {
    throw new Error("Invalid OTP, please enter the correct OTP");
  }
};

export const handleLogin = async (navigate) => {

  

  await supabase.auth.updateUser({
    data: { isRegistered: true },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  // localStorage.setItem("userSession",JSON.stringify(session));

  navigate("/");
};

export const handleSignupFlow = async (
  data,
  phone,
  navigate
) => {

    const res = await handleSignup({
      ...data,
      mobile_number: phone,
    }, false);

    if (res) {
      await supabase.auth.updateUser({
        data: { isRegistered: true },
      });
      navigate("/");
    }
  // }
};

export const handleSignup = async (data) => {
  const toastId = toast.loading("Loading...");
  try {
    console.log("data", data);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("session", session);
    const user_id = session?.user?.id;

    const { error: insertError } = await supabase.from(TABLES?.USER).insert([
      {
        mobile_number: data.mobile_number,
        name: data.name,
        user_id,
        referred_by: data?.referral || "NA", // Store referral if available
        profession: data?.profession || "NA", // must match one of your enum values
        income_range: data?.income_range || "NA", // any string is okay for text
        role: "Customer", //Change it according to delivery partner , admin, superadmin , Vendor
        updated_at: new Date().toISOString(),
        dp_url: "NA"
      },
    ]);

    if (insertError) {
      console.log("Error in inserting in to table", insertError);
      toast.dismiss(toastId);
      // toast.error(insertError.message);
      // showToast(insertError.message, "error", "short")
      return false;
    }

    await supabase.auth.updateUser({
      data: { isRegistered: true },
    });

    // toast.success("Account Created Successfully");
    toast.dismiss(toast.id);
    return true;
  } catch (error) {
    console.log("Error in handleSignup ", error);
    toast.dismiss(toastId);
    // toast.error(error.message);
    return false;
  }
};

export const logout = async (setSession ,showToast) => {
  try {
    await supabase.auth.updateUser({
      data: { isRegistered: false },
    });
    await supabase.auth.signOut();
    setSession(null);
    // toast.success("logged out");
  } catch (error) {
    // toast.error("Error in logging out");
    showToast("Error in logging out" , "error", "short")
    console.log(error);
  }
};

export const handleAuthError = (error) => {
  console.error("Authentication Error:", error);
  // toast.error(error.message);
};
