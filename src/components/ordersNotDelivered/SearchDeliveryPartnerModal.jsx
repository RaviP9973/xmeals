import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../supabaseclient";
import { useToast } from "../customtoast/CustomToast";
import { forceAssignDeliveryPartner, getDeliveryPartners } from "../../utils/order";
import { DP_RADIUS } from "../../constants/dp";
import CustomLoader from "../CustomLoader";

const PAGE_SIZE = 10;

const SearchDeliveryPartnerModal = ({
  open,
  onClose,
  onAssign,
  orderId,
  setOrders,
  orders,
}) => {
  if (!open) return null;
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  const { showToast } = useToast();
    const [assigningId, setAssigningId] = useState(null);


  const [cursor, setCursor] = useState({
    last_ts: null,
    last_dp_id: null,
  });
  const handleSearch = async () => {
    if (!search.trim()) {
      showToast("Please enter a mobile number", "error", "short");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("delivery_partner")
        .select("dp_id, name, mobile_no, image_url, distance, curr_group_id")
        .eq("mobile_no", `+91${search}`)
        .or("curr_group_id.is.null,curr_group_id.eq.na");

      if (error) throw error;
      setPartners(data || []);
      if (!data || data.length === 0) {
        showToast("No available delivery partners found", "info", "short");
      }
    } catch (err) {
      console.error("Error searching delivery partners:", err);
      showToast("Error searching delivery partners", "error", "short");
    } finally {
      setLoading(false);
    }
  };


  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Infinite scroll observer
  const observer = useRef();
  const lastPartnerRef = useCallback(
    (node) => {
      if (loadingMore || loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePartners();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, loading, hasMore, partners]
  );
  useEffect(() => {
    if (!open) return;
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const { data, success, error } = await getDeliveryPartners({
          location: orders?.pickup_location,
          radius: DP_RADIUS,
          last_ts: null,
          last_dp_id: null,
          limit: PAGE_SIZE,
        });

        if (error || !success) {
          throw error;
        }

        setPartners(data || []);
        setHasMore(data?.length === PAGE_SIZE);
        setCursor({
          last_ts: data?.length > 0 ? data[data.length - 1].last_available_ts : null,
          last_dp_id: data?.length > 0 ? data[data.length - 1].dp_id : null,
        });
        if (!data || data.length === 0) {
          showToast("No delivery partners found in this area", "info", "short");
        }
      } catch (error) {
        console.error("Error fetching delivery partners:", error);
        showToast("Error fetching delivery partners", "error", "short");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [open, orders]);

    // Load more partners for infinite scroll
  const loadMorePartners = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const { data, success, error } = await getDeliveryPartners({
        location: orders?.pickup_location,
        radius: DP_RADIUS,
        last_ts: cursor.last_ts,
        last_dp_id: cursor.last_dp_id,
        limit: PAGE_SIZE,
      });

      if (error || !success) {
        throw error;
      }

      setPartners((prev) => [...prev, ...(data || [])]);
      setHasMore(data?.length === PAGE_SIZE);
      setCursor({
        last_ts: data?.length > 0 ? data[data.length - 1].last_available_ts : null,
        last_dp_id: data?.length > 0 ? data[data.length - 1].dp_id : null,
      });
    } catch (error) {
      console.error("Error fetching more delivery partners:", error);
      showToast("Error fetching delivery partners", "error", "short");
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAssign = async (partner) => {
    setAssigningId(partner.dp_id);
    try {
      const { success,data, error } = await forceAssignDeliveryPartner(
        orderId,
        partner.mobile_no
      );
      if (!success || error) {
        
        showToast("Failed to assign delivery partner", "error", "long");
        setAssigningId(null);
        return;
      }
      console.log(data);
      showToast("Delivery Partner assigned successfully", "success", "long");
      // Remove the order card from the list
      if (setOrders && orders) {
        setOrders((prev) => prev.map((o) => o.order_id !== orderId ? o : { ...o, dp_id: partner.dp_id }));
      }
      onClose();
    } catch (err) {
      showToast("Failed to assign delivery partner", "error", "long");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl ">
        <h2 className="text-lg font-bold mb-4 text-orange-600">
          Search Delivery Partner
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter mobile number"
            className="border rounded px-3 py-2 w-full"
            maxLength={10}
          />
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded font-semibold hover:bg-orange-700"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto">
          
          { loading ? <CustomLoader /> :  partners.map((partner,index) => (
            <div
              key={partner.dp_id}
              className="flex items-center justify-between p-2 border-b"
              ref={ index === partners.length - 1 ? lastPartnerRef : null }
            >
              <div className="flex items-center gap-3">
                <img
                  src={partner.photo_url || "/placeholder.png"}
                  alt={partner.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <div className="font-semibold text-gray-800">
                    {partner.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {partner.mobile_no}
                  </div>
                  <div className="text-xs text-blue-500">
                    Distance:{" "}
                    {partner.distance_meters
                      ? `${(partner.distance_meters / 1000).toFixed(2)} km`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <button
                className={`px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold ${
                  assigningId === partner.dp_id ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={() => handleAssign(partner)}
                disabled={assigningId === partner.dp_id}
              >
                {assigningId === partner.dp_id ? "Assigning..." : "Assign"}
              </button>
              {
                loadingMore && <CustomLoader />
              }
            </div>
          
          ))}
          {!loading && partners.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              No partners found.
            </div>
          )}
        </div>
        <button
          className="mt-4 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchDeliveryPartnerModal;
