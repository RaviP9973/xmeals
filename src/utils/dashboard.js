import { TABLES } from "../constants/DBSchema";
import { supabase } from "../supabaseclient";

// Pending Orders
export const fetchPendingOrdersCount = async () => {
  try {
    const { count, error } = await supabase
      .from(TABLES.ORDERS)
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (error) {
      console.error(error);
      return 0;
    }
    return count || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// Active Orders
export const fetchActiveOrdersCount = async () => {
  const { count } = await supabase
    .from(TABLES.ORDERS)
    .select("*", { count: "exact", head: true })
    .neq("status", "delivered")
    .ne("status", "pending"); // sir ka suggestion chahiye yaha
  return count || 0;
};

// Delivered Orders
export const fetchDeliveredOrdersCount = async () => {
  const { count } = await supabase
    .from(TABLES.ORDERS)
    .select("*", { count: "exact", head: true })
    .eq("status", "delivered");
  return count || 0;
};

// Customer Cancelled Orders
export const fetchCancelledOrdersCount = async () => {
  const { count } = await supabase
    .from(TABLES.ORDERS)
    .select("*", { count: "exact", head: true })
    .eq("status", "cancelled");
  return count || 0;
};

// Restaurants
export const fetchRestaurantsCount = async () => {
  const { count } = await supabase
    .from(TABLES.VENDORS)
    .select("*", { count: "exact", head: true });
  return count || 0;
};

// Categories
export const fetchCategoriesCount = async () => {
  const { count } = await supabase
    .from(TABLES.ITEM_CATEGORY)
    .select("*", { count: "exact", head: true });
  return count || 0;
};

// Food Items
export const fetchFoodItemsCount = async () => {
  const { count } = await supabase
    .from(TABLES.ITEM)
    .select("*", { count: "exact", head: true });
  return count || 0;
};

// Promotions
// export const fetchPromotionsCount = async () => {
//   const { count } = await supabase
//     .from(TABLES.OFFER_BANNER)
//     .select("*", { count: "exact", head: true });
//   return count || 0;
// };

// Revenue by date (for delivered orders)
export const fetchRevenueByDate = async (start, end) => {
  console.log(start, end);
  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .select("order_date:created_ts, total_amount")
    .eq("status", "delivered")
    .gte("created_ts", start)
    .lte("created_ts", end);

  console.log(data, error);
  // Group by date
  const revenueMap = {};
  data?.forEach((order) => {
    const date = order.order_date.split("T")[0];
    revenueMap[date] = (revenueMap[date] || 0) + (order.total_amount || 0);
  });
  return revenueMap; // { '2024-06-01': 1200, ... }
};

// Orders count by date
export const fetchOrdersCountByDate = async (start, end) => {
  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .select("created_ts")
    .gte("created_ts", start)
    .lte("created_ts", end);

  console.log("data,error", data, error);

  // Group by date
  const countMap = {};
  data?.forEach((order) => {
    const date = order.created_ts.split("T")[0];
    countMap[date] = (countMap[date] || 0) + 1;
  });
  return countMap; // { '2024-06-01': 10, ... }
};

export const fetchAllOrderStatusCounts = async () => {
  const { data, error } = await supabase.rpc("get_order_status_counts");

  if (error) {
    console.error("Failed to fetch grouped counts:", error);
    return {
      pending: 0,
      delivered: 0,
      cancelled: 0,
      active: 0, // derived below
    };
  }

  const counts = {
    pending: 0,
    delivered: 0,
    cancelled: 0,
    active: 0, // not a real status, calculated as "not delivered"
  };

  data.forEach(({ status, count }) => {
    if (status === "pending") counts.pending = count;
    if (status === "delivered") counts.delivered = count;
    if (status === "cancelled") counts.cancelled = count;
    if (status !== "delivered") {
      counts.active += count;
    }
  });

  return counts;
};

export const fetchDpCount = async () => {
  try {
    const { count, error } = await supabase
      .from(TABLES.DELIVERY_PARTNER)
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error(error);
      return 0;
    }
    return count || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const allCustomerCount = async () => {
  try {
    const { count, error } = await supabase
      .from(TABLES?.USER)
      .select("*", { count: "exact", head: true })
      .eq('role', "Customer");

    if (error) {
      console.error(error);
      return 0;
    }

    return count;
  } catch (error) {
    console.error(error);
    return 0;
  }
};


export const getAverageOrderValue = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select("discounted_amount")
      .eq("status", "delivered");

    if (error) {
      console.error(error);
      return 0;
    }

    if (!data || data.length === 0) return 0;

    const total = data.reduce((sum, order) => sum + (order.discounted_amount || 0), 0);
    const avg = total / data.length;

    return avg;
  } catch (error) {
    console.error(error);
    return 0;
  }
};


export const fetchRepeatCustomersByDate = async (start, end) => {
  // 1. Get all orders up to 'end' date (so we can check history)
  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .select("u_id, created_ts")
    .lte("created_ts", end);

  if (error){
    console.error(error);
    return {}
  };

  // console.log("data",data)

  // 2. Group all orders by user
  const userOrders = {};
  data.forEach(order => {
    if (!userOrders[order.u_id]) userOrders[order.u_id] = [];
    userOrders[order.u_id].push(order.created_ts);
  });

  // console.log("userOrders",userOrders);

  // 3. Sort each user's orders
  Object.values(userOrders).forEach(arr => arr.sort());

  // 4. Get all dates in the selected range
  const rangeStart = new Date(start);
  const rangeEnd = new Date(end);
  const allDates = [];
  for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
    allDates.push(d.toISOString().slice(0, 10));
  }

  // 5. For each date, count users who ordered that day AND had ordered before that day (anytime)
  const repeatMap = {};
  allDates.forEach(date => {
    let count = 0;
    Object.values(userOrders).forEach(orderDates => {
      // Has order on this date?
      if (orderDates.some(ts => ts.startsWith(date))) {
        // Has order before this date (anytime)?
        if (orderDates.some(ts => ts < `${date}T00:00:00`)) {
          count++;
        }
      }
    });
    repeatMap[date] = count;
  });

  return repeatMap;
};