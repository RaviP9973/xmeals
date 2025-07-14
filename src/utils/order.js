import { TABLES } from "../constants/DBSchema";
import { supabase } from "../supabaseclient";

export const getNotDeliveredOrders = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES?.ORDERS)
      .select("*")
      .neq("status", "delivered")
      .limit(10);

    if (error) {
      throw error;
    }
    
    return {
      success: true,
      error: null,
      data,
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


export const getAllOrders = async (created_ts,order_id) => {
  try {

    let query = supabase
      .from(TABLES?.ORDERS)
      .select(
        `
        *,
        ${TABLES?.VENDORS}:v_id (
          v_id,
          shop_name,
          banner_url,
          expected_dt_ms,
          street,
          city,
          state
        ),
        order_item!order_item_order_id_fkey (
          order_id,
          item_id,
          quantity,
          items:item_id (
            item_id,
            item_name,
            veg
          )
        )
      `
      )
      .neq("status", "delivered")
      .order("created_ts", { ascending: false })
      .order("order_id", {ascending:false});
      // .limit(10);


      if(created_ts !== null && order_id !== null){
        query = query.or(
          `and(created_ts.lt.${created_ts}),and(created_ts.eq.${created_ts},order_id.lt.${order_id})`
        )
      }

      query = query.limit(10);
      const {data,error} = await query;
    // console.log(data);




    if (error) {
      console.error("Error fetching orders:", error);
      return { success: false, data: null, error };
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error in fetchUserOrders:", error);
    return { success: false, data: null, error };
  }
};