import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaPlus,
  FaUserCheck,
  FaUserClock,
  FaUserSlash,
  FaUserTimes,
} from "react-icons/fa";

import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { fetchDeliveryPartner } from "../utils/delivery";
import DpCard from "../components/manageDp/DpCard";
import { useDp } from "../context/dpContext";
import DpCardSkeleton from "../components/skeltons/DpCardSkelton";
import NoDpFound from "../components/manageDp/NoDpFound";

const tabs = [
  {
    id: "existing",
    label: "Existing",
    icon: <FaUserCheck />,
    value: "verified",
  },
  {
    id: "requests",
    label: "Requests",
    icon: <FaUserClock />,
    value: "not_verified",
  },
  { id: "blocked", label: "Blocked", icon: <FaUserSlash />, value: "blocked" },
  {
    id: "rejected",
    label: "Rejected",
    value: "rejected",
    icon: <FaUserTimes />,
  },
];

const ManageDp = () => {
  const [activeTab, setActiveTab] = useState("existing");
  const { dps, setDps } = useDp();

  const handleAddNewVendor = () => {
    // add new vendor
    console.log("Added new vendor");
  };
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const PAGE_SIZE = 10;

  /***********fetch dp details  *******/
  useEffect(() => {
    const fetchDp = async () => {
      setLoading(true);
      try {
        const selectedTab = tabs?.find((tab) => tab?.id === activeTab);
        const status = selectedTab?.value;
        const { data, success, error } = await fetchDeliveryPartner(
          status,
          PAGE_SIZE,
          null
        );
        if (error || !success) {
          setDps([]);
          setHasMore(false);
          return;
        }
        setDps(data);
        setHasMore(data.length === PAGE_SIZE);
        setCursor({
          dp_id: data?.length ? data[data.length - 1].dp_id : null,
          updated_ts: data?.length ? data[data.length - 1].updated_ts : null,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDp();
  }, [activeTab, setDps]);

  const observer = useRef();
  const lastDpRef = useCallback(
    (node) => {
      if (loadingMore || loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, loading, hasMore, dps]
  );

  // Load more function
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const selectedTab = tabs?.find((tab) => tab?.id === activeTab);
      const status = selectedTab?.value;
      const { data, success, error } = await fetchDeliveryPartner(
        status,
        PAGE_SIZE,
        cursor
      );
      if (error || !success) {
        setHasMore(false);
        return;
      }
      setDps((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setCursor({
        dp_id: data?.length ? data[data.length - 1].dp_id : null,
        updated_ts: data?.length ? data[data.length - 1].updated_ts : null,
      });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen mx-auto p-6 animate-fade-in bg-gray-100 max-w-3/4">
      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300
          ${
            activeTab === tab?.id
              ? "bg-primary text-white shadow-md scale-[1.02]"
              : "bg-light text-gray-dark hover:bg-[#e2e6ea]"
          }`}
          >
            {tab.icon}
            <span className="text-sm sm:text-base">{tab?.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        [1, 2, 3].map((card, index) => (
          <div className="mb-2" key={index}>
            <DpCardSkeleton />
          </div>
        // </div>

        

        // {/* Right Side - Status and Actions */}
        // <div className="space-y-2 text-right ">
        //   <p className="text-dark font-medium flex items-center justify-end gap-2">Status: 
        //     <IoCheckmarkCircleSharp className="text-xl text-success"/>
        //     </p>
        //   <p className="text-gray text-sm">Orders with him: 3</p>
        //   <div className="flex flex-wrap justify-between gap-2 pt-2">
        //     <button
        //       className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 transition-all text-sm font-semibold rounded-lg border border-green-200 shadow-sm"
        //       onClick={handleAprove}
        //       aria-label="Approve"
        //     >
        //       <FaCheckCircle className="text-lg" /> Approve
        //     </button>

        //     <button
        //       className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-all text-sm font-semibold rounded-lg border border-yellow-200 shadow-sm"
        //       onClick={handleReject}
        //       aria-label="Reject"
        //     >
        //       <FaTimes className="text-lg" /> Reject
        //     </button>

        //     <button
        //       className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 transition-all text-sm font-semibold rounded-lg border border-red-200 shadow-sm"
        //       onClick={handleBlock}
        //       aria-label="Block"
        //     >
        //       <FaBan className="text-lg" /> Block
        //     </button>
        ))
      ) : dps?.length === 0 ? (
        <NoDpFound tabLabel={tabs.find((t) => t.id === activeTab)?.label} />
      ) : (
        dps.map((dp, idx) => (
          <div
            className="mb-2"
            key={dp?.dp_id}
            ref={idx === dps.length - 1 ? lastDpRef : null}
          >
            <DpCard dp={dp} tab={activeTab} />
          </div>
        ))
      )}

      {/* Add New Vendor Button
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110"
        onClick={handleAddNewVendor}
      >
        <FaPlus className="text-xl" />
      </button> */}
    </div>
  );
};

export default ManageDp;
