import { TABLES } from "../constants/DBSchema";
import { supabase } from "../supabaseclient";

export const fetchDeliveryPartner = async (status, size, cursor = null) => {
  try {
    let query = supabase
      .from(TABLES?.DELIVERY_PARTNER)
      .select("*")
      .eq("status", status)
      .order("updated_ts", { ascending: false })
      .order("dp_id", { ascending: false }) // or use created_at if available
      .limit(size);

    // Cursor should be an object: { updated_ts, dp_id }
    if (cursor && cursor.updated_ts && cursor.dp_id) {
      // For Supabase/Postgres, use or() for composite cursor pagination
      query = query.or(
        `and(updated_ts.lt.${cursor.updated_ts}),and(updated_ts.eq.${cursor.updated_ts},dp_id.lt.${cursor.dp_id})`
      );
    }


    
    const { data, error } = await query;

    let partnersWithOrders;
    if (status === "verified") {
      partnersWithOrders = await Promise.all(
        data?.map(async (dp) => {
          const { count, error: orderError } = await supabase
            .from(TABLES.ORDERS)
            .select("*", { count: "exact", head: true })
            .eq("dp_id", dp?.dp_id)
            .eq("status", "on the way");

          console.log(count, dp?.dp_id);
          return {
            ...dp,
            total_orders: count || 0,
          };
        })
      );
    }

    if (error) throw error;
    return {
      success: true,
      error: null,
      data: status === "existing" ? partnersWithOrders : data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
      data: null,
    };
  }
};

export const aproveDp = async (dpId, adminId) => {
  try {
    if (!dpId || !adminId) {
      return { success: false, error: "Details missing", data: null };
    }
    const { data, error } = await supabase
      .from(TABLES.DELIVERY_PARTNER)
      .update({
        status: "verified",
        approved_by: adminId,
        updated_ts: new Date().toISOString(),
      })
      .eq("dp_id", dpId)
      .select();
    if (error) return { success: false, data: null, error };
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const rejectDp = async (dpId, adminId) => {
  try {
    if (!dpId || !adminId) {
      return { success: false, error: "Details missing", data: null };
    }
    const { data, error } = await supabase
      .from(TABLES.DELIVERY_PARTNER)
      .update({
        status: "rejected",
        // rejected_by: adminId,
        updated_ts: new Date().toISOString(),
      })
      .eq("dp_id", dpId)
      .select();
    if (error) return { success: false, data: null, error };
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const blockDp = async (dpId, adminId) => {
  try {
    if (!dpId || !adminId) {
      return { success: false, error: "Details missing", data: null };
    }
    const { data, error } = await supabase
      .from(TABLES.DELIVERY_PARTNER)
      .update({
        status: "blocked",
        // blocked_by: adminId,
        updated_ts: new Date().toISOString(),
      })
      .eq("dp_id", dpId)
      .select();
    if (error) return { success: false, data: null, error };
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};


export const unBlockDp = async (dpId, adminId) => {
  try {
    if (!dpId || !adminId) {
      return { success: false, error: "Details missing", data: null };
    }
    const { data, error } = await supabase
      .from(TABLES.DELIVERY_PARTNER)
      .update({
        status: "verified",
        approved_by:adminId,
        updated_ts: new Date().toISOString(),
      })
      .eq("dp_id", dpId)
      .select();
    if (error) return { success: false, data: null, error };
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};
