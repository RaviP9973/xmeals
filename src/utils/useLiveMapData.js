import { useCallback, useEffect, useRef, useState } from "react";
import { getAllOrders } from "../utils/order";
import { fetchDeliveryPartner } from "../utils/delivery";
import { fetchVendorsWithGivenStatus } from "../utils/vendor";
import { getDistanceFromLatLonInKm } from "../utils/geo";

const RADIUS_KM = 10;

function jitterCoords(arr, latKey, lngKey) {
  const res = [];
  const seen = new Set();
  arr.forEach(item => {
    let lat = item[latKey], lng = item[lngKey];
    const key = `${lat},${lng}`;
    if (seen.has(key)) {
      const jitter = (Math.random() - 0.5) * 0.0003;
      lat += jitter;
      lng += jitter;
    }
    seen.add(key);
    res.push({ ...item, [latKey]: lat, [lngKey]: lng });
  });
  return res;
}

// actual Haversine for completeness, otherwise pull from common geo.js
// export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   function deg2rad(deg) { return deg * (Math.PI / 180); }
//   const R = 6371;
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//     Math.cos(deg2rad(lat2)) *
//     Math.sin(dLon / 2) *
//     Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// --- MAIN HOOK: Handles fetch + process for use in your map page
export function useLiveMapData(selectedLocation, showToast) {
  const [orders, setOrders] = useState([]);
  const [dps, setDps] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [unavailableVendors, setUnavailableVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDps, setLoadingDps] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // Orders fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, success, error } = await getAllOrders(null, null);
        if (!success || error) {
          showToast && showToast("Error fetching orders!", "error");
          setOrders([]);
        } else {
          const cleanOrders = (data || []).map(order => {
            let lat = null, lng = null;
            if (order.user_lat != null && order.user_lat !== "")
              lat = parseFloat(order.user_lat);
            if (order.user_long != null && order.user_long !== "")
              lng = parseFloat(order.user_long);
            return { ...order, lat, lng };
          });
          setOrders(cleanOrders);
        }
      } catch {
        showToast && showToast("Error fetching orders!", "error");
        setOrders([]);
      }
      setLoading(false);
    })();
  }, [showToast]);

  // DPs fetch
  useEffect(() => {
    (async () => {
      setLoadingDps(true);
      try {
        const { data, success, error } = await fetchDeliveryPartner("verified", 500, null);
        if (!success || error) {
          showToast && showToast("Error fetching Delivery Partners!", "error");
          setDps([]);
        } else {
          const cleanDps = (data || []).map(dp => {
            let lat = null, long = null;
            if (dp.lat != null && dp.lat !== "") lat = parseFloat(dp.lat);
            if (dp.long != null && dp.long !== "") long = parseFloat(dp.long);
            return { ...dp, lat, long };
          });
          setDps(cleanDps);
          console.log(cleanDps);
          
        }
      } catch {
        showToast && showToast("Error fetching Delivery Partners!", "error");
        setDps([]);
      }
      setLoadingDps(false);
    })();
  }, [showToast]);

  // Vendors fetch (verified)
  useEffect(() => {
    (async () => {
      setLoadingVendors(true);
      try {
        const { data: allVerified, success } = await fetchVendorsWithGivenStatus("verified", 150, null, null);
        if (success && allVerified) {
          const avail = allVerified.filter(v => v.available === true);
          const unavail = allVerified.filter(v => v.available === false);
          setAvailableVendors(avail);
          setUnavailableVendors(unavail);
        } else {
          setAvailableVendors([]);
          setUnavailableVendors([]);
        }
      } catch {
        setAvailableVendors([]);
        setUnavailableVendors([]);
      }
      setLoadingVendors(false);
    })();
  }, []);

  // Filter and jitter:
  const filteredOrders = selectedLocation && orders.length
    ? orders.filter(order =>
        typeof order.lat === "number" &&
        !isNaN(order.lat) &&
        typeof order.lng === "number" &&
        !isNaN(order.lng) &&
        getDistanceFromLatLonInKm(
          selectedLocation.lat, selectedLocation.lng, order.lat, order.lng
        ) <= RADIUS_KM
      )
    : [];
  const filteredDps = selectedLocation && dps.length
    ? dps.filter(dp =>
        typeof dp.lat === "number" &&
        !isNaN(dp.lat) &&
        typeof dp.long === "number" &&
        !isNaN(dp.long) &&
        getDistanceFromLatLonInKm(
          selectedLocation.lat, selectedLocation.lng, dp.lat, dp.long
        ) <= RADIUS_KM
      )
    : [];

  const filteredAvailableVendors = selectedLocation && availableVendors.length
    ? availableVendors.filter(v =>
        typeof v.latitude === "number" &&
        !isNaN(v.latitude) &&
        typeof v.longitude === "number" &&
        !isNaN(v.longitude) &&
        getDistanceFromLatLonInKm(
          selectedLocation.lat, selectedLocation.lng, v.latitude, v.longitude
        ) <= RADIUS_KM
      )
    : [];
  const filteredUnavailableVendors = selectedLocation && unavailableVendors.length
    ? unavailableVendors.filter(v =>
        typeof v.latitude === "number" &&
        !isNaN(v.latitude) &&
        typeof v.longitude === "number" &&
        !isNaN(v.longitude) &&
        getDistanceFromLatLonInKm(
          selectedLocation.lat, selectedLocation.lng, v.latitude, v.longitude
        ) <= RADIUS_KM
      )
    : [];

  // Jitter
  const ordersWithCoords = jitterCoords(filteredOrders, "lat", "lng");
  const dpWithCoords = jitterCoords(filteredDps, "lat", "long");
  console.log(dpWithCoords);
  
  const availVendorCoords = jitterCoords(filteredAvailableVendors, "latitude", "longitude");
  const unavailVendorCoords = jitterCoords(filteredUnavailableVendors, "latitude", "longitude");

  return {
    ordersWithCoords,
    dpWithCoords,
    availVendorCoords,
    unavailVendorCoords,
    loading,
    loadingDps,
    loadingVendors,
  };
}
