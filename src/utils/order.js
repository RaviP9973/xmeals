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

export const forceAssignDeliveryPartner = async (order_id, mobile_number) => {
  try {
    console.log("i am coming here", order_id, mobile_number);
    if (!order_id || !mobile_number) {
      throw new Error("Order ID and mobile number are required");
    }
    const {data,error} = await supabase.rpc('force_assign_group_to_dp', {
      p_order_id: order_id,
      p_dp_contact_number: mobile_number
    })

    if(error) {
      throw error;
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error assigning delivery partner:", error);
    return {
      success: false,
      data: null,
      error,
    };
  }
}

export const getDeliveryPartners = async (data) => {
  try {
    console.log("data",data);
    const {data:dpData,error} = await supabase
      .rpc('find_available_delivery_partners_cursor', {
        p_location: data?.location,
        p_radius: data?.radius,
        p_last_ts: data?.last_ts,
        p_last_dp_id: data?.last_dp_id,
        p_limit: data?.limit || 10
      })


      console.log("dpData",dpData);
      if(error) {
        throw error;
      }
      
      return {
        success: true,
        data: dpData,
        error: null,
      };

  } catch (error) {
    console.error("Error fetching delivery partners:", error);
    return {
      success: false,
      data: null,
      error,
    };
  }
}