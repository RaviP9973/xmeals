import { TABLES } from "../constants/DBSchema";
import { supabase } from "../supabaseclient";

export const fetchVendorsWithGivenStatus = async (
  status,
  limit = 5,
  ratingCursor = null,
  idCursor = null
) => {
  try {
    let query = supabase
      .from(TABLES?.VENDORS)
      .select("*")
      .eq("status", status)
      .order("rating", { ascending: false }) // Order by highest rating
      .order("v_id", { ascending: false }); // Tie-breaker for equal ratings

    // Apply cursor if available
    if (ratingCursor !== null && idCursor !== null) {
      query = query.or(
        `and(rating.lt.${ratingCursor}),and(rating.eq.${ratingCursor},v_id.lt.${idCursor})`
      );
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        error,
      };
    }

    return {
      data,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error,
    };
  }
};

export const aproveVendor = async (vendorId, adminId) => {
  try {
    if (!vendorId || !adminId) {
      console.log("Vendor is  required");
      return {
        success: false,
        error: "Details missing",
        data: null,
      };
    }

    const { data, error } = await supabase
      .from(TABLES?.VENDORS)
      .update({
        status: "verified",
        approved_by: adminId,
        updated_at: new Date().toISOString(), // optional: track update
      })
      .eq("v_id", vendorId)
      .select();

    if (error) {
      return {
        success: false,
        data: null,
        error,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
    };
  }
};
export const rejectVendor = async (vendorId, adminId, reason) => {
  try {
    if (!vendorId || !adminId) {
      console.log("Vendor is  required");
      return {
        success: false,
        error: "Details missing",
        data: null,
      };
    }

    const { data, error } = await supabase
      .from(TABLES?.VENDORS)
      .update({
        status: "rejected",
        // approved_by: adminId,
        updated_at: new Date().toISOString(), // optional: track update
        rejection_reason: reason,
      })
      .eq("v_id", vendorId)
      .select();

    if (error) {
      return {
        success: false,
        data: null,
        error,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
    };
  }
};

export const handleEditVendor = async (vendorId, warningText, session) => {
  try {
    if (!vendorId) {
      console.log("Vendor is  required");
      return {
        success: false,
        error: "Details missing",
        data: null,
      };
    }

    window.open(
      `https://vendor-registration-nine.vercel.app/home?vendorId=${vendorId}&token=${session?.access_token}&refresh=${session?.refresh_token}`,
      "_blank",
      "noopener"
    );
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
    };
  }
};

export const blockVendor = async (vendorId, adminId, reason = "") => {
  try {
    if (!vendorId || !adminId) {
      console.log("Vendor and admin are required");
      return {
        success: false,
        error: "Details missing",
        data: null,
      };
    }

    const { data, error } = await supabase
      .from(TABLES?.VENDORS)
      .update({
        status: "blocked",
        blocked_by: adminId,
        updated_at: new Date().toISOString(),
        // block_reason: reason,
      })
      .eq("v_id", vendorId)
      .select();

    if (error) {
      return {
        success: false,
        data: null,
        error,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
    };
  }
};
export const unblockVendor = async (vendorId, adminId, reason = "") => {
  try {
    if (!vendorId) {
      console.log("Vendor  id is required");
      return {
        success: false,
        error: "Details missing",
        data: null,
      };
    }

    const { data, error } = await supabase
      .from(TABLES?.VENDORS)
      .update({
        status: "verified",
        updated_at: new Date().toISOString(),
      })
      .eq("v_id", vendorId)
      .select();

    if (error) {
      return {
        success: false,
        data: null,
        error,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
    };
  }
};

export const searchVendors = async (searchQuery) => {
  try {
    if (!searchQuery || searchQuery.trim() === "") {
      return { success: true, data: [], error: null };
    }

    const { data, error } = await supabase
      .from(TABLES?.VENDORS)
      .select("*")
      .or(
        `shop_name.ilike.%${searchQuery}%,mobile_number.ilike.%${searchQuery}%`
      ) // Case-insensitive search
      .limit(10);

      if (error) {
      console.error("Error",error)
      return { success: false, data: null, error };
    }

    console.log(data)
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};
