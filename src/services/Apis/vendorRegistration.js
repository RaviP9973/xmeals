import toast from "react-hot-toast";
import { supabase } from "../../supabaseclient";

export const vendorRegistration = async (user_id, vendor_data) => {
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, blocked, is_vendor")
      .eq("id", user_id)
      .single();

    // check userExits or not
    if (userError || !user) {
        toast.error("User does not exist.");
        return;
    }

    // check user is blocked or not 
    if(user.blocked){
        toast.warning("You are blocked to register your vender");
        return;
    }

    // check user is vendor
    if(!user.is_vendor){
        toast.warning("Only vendors can register");
        return ;
    }

    // add data to supabase
    const { data, error } = await supabase
    .from("vendors")
    .insert([{ user_id: user_id, ...vendor_data }]);

  } catch (error) {}
};
