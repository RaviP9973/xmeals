import React, { useCallback, useEffect, useRef, useState } from "react";
import OrderCard from "../../components/ordersNotDelivered/OrderCard";
import { getAllOrders } from "../../utils/order";
import { useToast } from "../../components/customtoast/CustomToast";
import Loader from "../../components/Loader";
import CustomLoader from "../../components/CustomLoader";

const OrdersNotDelivered = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [showAllMap, setShowAllMap] = useState({});
  const toggleShowAll = (orderId) => {
    setShowAllMap((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const pageSize = 10;
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState({
    created_ts: null,
    order_id: null,
  });
  const observer = useRef();
  const lastOrderRef = useCallback(
    (node) => {
      if (loading || loadingMore) return; // Fix: check both loading and loadingMore
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreOrders();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, orders]
  );

  const loadMoreOrders = async () => {
    if (loadingMore) return; // Prevent duplicate calls
    setLoadingMore(true);
    try {
      // const lastCuisine = cuisines[cuisines?.length - 1];
      const { data, success, error } = await getAllOrders(
        cursor?.created_ts,
        cursor?.order_id
      );

      if (error || !success) {
        showToast.error("Error loading more orders", "error", "long");
        setHasMore(false); // Stop further loading on error
        return;
      }

      setCursor({
        order_id: data[data?.length - 1]?.order_id,
        created_ts: data[data?.length - 1]?.created_ts,
      });
      if (!data || data.length === 0) {
        setHasMore(false); // No more data
      } else {
        setOrders((prev) => [...prev, ...data]);
        if (data.length < pageSize) setHasMore(false); // Less than page size means no more data
      }
    } catch (err) {
      showToast("Something went wrong", "error", "long");
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const getAllOrder = async () => {
      setLoading(true);
      try {
        const { success, data, error } = await getAllOrders(null, null);

        if (!success || error) {
          console.error("Error in fetching the user's orders", error);
          return;
        }

        console.log("data", data);
        setCursor({
          order_id: data[data?.length - 1]?.order_id,
          created_ts: data[data?.length - 1]?.created_ts,
        });
        await setOrders(data);

        // setallOrderItems(data);
        // setTotalOrders(data?.length);
      } catch (error) {
        console.error("error", error);
        // toast.error(error.message);
        showToast(error.message, "error", "medium");
      } finally {
        setLoading(false);
      }
    };

    getAllOrder();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="flex items center justify-center border-b-2 border-dashed py-3">
        <h2 className="text-bold text-lg text-black">
          Orders(Not Delivered)
        </h2>
      </div>

      <div className="className='w-[95%] lg:w-[90%] mx-auto">
        {orders?.map((order, index) => (
          // const isLast = index === cuisines.length - 1;
          <div
            className="relative w-full mt-2 space-y-4"
            key={order?.order_id}
            ref={index === orders.length - 1 ? lastOrderRef : null}
          >
            <OrderCard
              order={order}
              setOrders={setOrders}
              showAllMap={showAllMap}
              toggleShowAll={toggleShowAll}
            />
          </div>

        ))}

        {
          loadingMore && 
          <div className="h-12 my-auto flex items-center w-screen justify-center  ">
            <CustomLoader size="small"/>

          </div>
        }
      </div>
    </div>
  );
};

export default OrdersNotDelivered;
