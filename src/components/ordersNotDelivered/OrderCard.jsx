import { useState } from "react";
import { useToast } from "../customtoast/CustomToast";
import { forceAssignDeliveryPartner } from "../../utils/order";
import SearchDeliveryPartnerModal from "./SearchDeliveryPartnerModal";

const OrderCard = ({ order, showAllMap ,toggleShowAll,setOrders}) => {
  
  const {showToast } = useToast();
  const [dpLoading,setDpLoading] = useState(false);
  const [openModal,setOpenModal] = useState(false);



  const forceAssignDp = async () => {
    try{
      setDpLoading(true);
      const {data,success,error} = await forceAssignDeliveryPartner(order?.order_id , "+919140312239");

      if(error || !success) {
        throw error;
      }

      console.log("data",data);
      showToast("Delivery Partner assigned successfully", "success", "long");

    }catch (error) {
      console.error("Error assigning delivery partner:", error);
      showToast("Failed to assign delivery partner", "error", "long");
    }finally{
      setDpLoading(false);
    }
    

  }
  return (
    <div
      className="relative w-full p-4 bg-gradient-to-br from-orange-50 to-yellow-50 customRadius shadow-xl cursor-pointer"
      key={order?.order_id}
    >
      {/* Vendor Info Section */}
      <div className="flex items-center gap-4 border-b border-dashed border-orange-300 pb-3 w-full">
        {order?.vendor_request?.banner_url ? (
          <img
            src={order?.vendor_request?.banner_url}
            alt="Vendor Banner"
            className="w-10 lg:w-12 h-10 lg:h-12 rounded-full object-cover shadow-lg ring-4 ring-orange-200"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        ) : (
          <div
            className="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-gradient-to-br from-orange to-yellow text-white font-bold text-xl flex items-center justify-center shadow-lg ring-4 ring-orange-200 "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {order?.vendor_request?.shop_name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex items-start justify-between w-full overflow-hidden">
          <div className="space-y-0 lg:space-y-1 w-[60%]">
            <h1 className="text-base lg:text-lg font-bold text-orange w-[150px]  lg:w-[80%] truncate">
              {order?.vendor_request?.shop_name}
            </h1>
            <div
              className="text-[10px] lg:text-sm text-gray mt-0 lg:-mt-1 w-full truncate"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {`${order?.vendor_request?.street}, ${order?.vendor_request?.city}`}
            </div>

          </div>

          <div className="flex items-end flex-col ">
            <div className="bg-gradient-to-br text-green font-semibold flex items-center justify-center w-16 lg:w-28 h-6 customRadius text-[10px] lg:text-sm capitalize">
              {order?.status}
            </div>

            {/* {order?.vendor_request?.expected_dt_ms !== -1 && (
              <div className="mt-1 text-[9px] lg:text-sm text-red font-medium">
                {`Arriving in ${
                  order?.vendor_request?.expected_dt_ms / (60 * 1000)
                } mins`}
              </div>
            )} */}
            {
  !order?.dp_id && (
    <button
      className="mt-2 px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow border border-orange-200 transition-all duration-150 flex items-center gap-2 disabled:bg-orange-300 disabled:cursor-not-allowed"
      style={{ minWidth: "140px" }}
      onClick={()=>setOpenModal(prev => !prev)}
      disabled={dpLoading}
    >
      Assign Delivery Partner
    </button>
  )
}
          </div>
        </div>
      </div>

      {/* Order Items Section */}
      <div
        className="p-3 customRadius bg-white/70 backdrop-blur-sm shadow-inner mt-3 overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex flex-wrap gap-2">
          {(
            showAllMap[order?.order_id]
            ? 
            order?.order_item
            : order?.order_item?.slice(0, 3)
          )?.map((orderItem, index) => (
            <div key={orderItem.item_id} className="flex items-center ">
              <span className="text-sm font-semibold text-gray truncate max-w-[100px] lg:max-w-[150px] ">
                {orderItem?.quantity}× {orderItem?.items?.item_name}
              </span>
              {index <
                (showAllMap[order?.order_id] ? order?.order_item?.length : 3) -
                  1 && <span className="text-gray-400">•</span>}
            </div>
          ))}

          {order?.order_item?.length > 3 && !showAllMap[order?.order_id] && (
            <button
              onClick={() => toggleShowAll(order?.order_id)}
              className="text-orange-500 text-sm font-medium hover:underline"
            >
              see more
            </button>
           )} 
        </div>
      </div>

      {/* Order Time */}
      <div
        className="p-3 customRadius bg-white/70 backdrop-blur-sm shadow-inner mt-2 text-sm lg:text-base font-semibold text-gray"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        Placed At{" "}
        {new Date(order?.created_ts)?.toLocaleString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>

<SearchDeliveryPartnerModal
  open={openModal}
  onClose={() => setOpenModal(prev => !prev)}
  orderId={order?.order_id}
  setOrders={setOrders}
  orders={order}
/>
    </div>
  );
};

export default OrderCard;
