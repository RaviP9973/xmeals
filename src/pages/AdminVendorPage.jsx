import React, { useCallback, useEffect, useRef, useState } from "react";
import VendorItem from "../components/VendorItem";
import {
  FaSearch,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaUserSlash,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import NoDataFound from "../components/NoData";
import { fetchVendorsWithGivenStatus } from "../utils/vendor";
import { useToast } from "../components/customtoast/CustomToast";
import SkeletonVendorList from "../components/skeltons/vendorsSkelton";
import { toast } from "react-toastify";
import RejectCommentModal from "../components/AdminVendor/RejectCommentModal";
import { useVendor } from "../context/vendorContext";
import SearchInput from "../components/AdminVendor/SearchInput";
import CustomLoader from "../components/CustomLoader";

const tabs = [
  {
    id: "existing",
    label: "Existing",
    value: "verified",
    icon: <FaUserCheck />,
  },
  {
    id: "requests",
    label: "Requests",
    value: "pending",
    icon: <FaUserClock />,
  },
  {
    id: "rejected",
    label: "Rejected",
    value: "rejected",
    icon: <FaUserTimes />,
  },
  { id: "blocked", label: "Blocked", value: "blocked", icon: <FaUserSlash /> },
];
const AdminVendorPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.defaultTab || "existing"
  );
  const [loading, setLoading] = useState(false);
  const { vendors, setVendors,searchedVendors, setsearchedVendors ,searchQuery, setSearchQuery,searchLoading, setSearchLoading} = useVendor();

  const [loadingMore, setLoadingMore] = useState(false);
  const { showToast } = useToast();

  const [showRejectModal, setShowRejectModal] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const lastVendorRef = useCallback(
    (node) => {
      if (loadingMore || loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreVendors();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, vendors]
  );

  const loadMoreVendors = async () => {
    setLoadingMore(true);
    try {
      const lastVendor = vendors[vendors?.length - 1];
      const selectedTab = tabs?.find((tab) => tab?.id === activeTab);
      const status = selectedTab?.value;
      const { data, success, error } = await fetchVendorsWithGivenStatus(
        status,
        5,
        lastVendor?.rating,
        lastVendor?.v_id
      );

      if (error || !success) {
        toast.error("Error loading more cuisines");
        return;
      }

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setVendors((prev) => [...prev, ...data]);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRejectSubmit = (comment) => {
    // Call your rejectVendor API here, passing the comment
    // rejectVendor(vendor.v_id, comment);
    // setShowRejectModal(false);
    // const {}
  };


  useEffect(() => {
    const fetchVendors = async () => {
      try {
        if (loading) return;
        setLoading(true);
        const selectedTab = tabs?.find((tab) => tab?.id === activeTab);
        const status = selectedTab?.value;

        const { success, error, data } = await fetchVendorsWithGivenStatus(
          status,
          10,
          null,
          null
        );

        if (error || !success) {
          console.error(error);
          showToast(error);
          setVendors([]);
          return;
        }

        console.log(data);
        setVendors(data);
      } catch (error) {
        console.log(error);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [activeTab]);

  return (
    <div className="p-6 min-h-screen mx-auto bg-gray-100 w-full md:max-w-3/4">
      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300
          ${
            activeTab === tab?.id
              ? "bg-primary text-white shadow-md scale-[1.02]"
              : "bg-light text-gray-dark hover:bg-[#e2e6ea]"
          }`}
          >
            {tab?.icon}
            <span className="text-sm sm:text-base">{tab?.label}</span>
          </button>
        ))}
      </div>

      <SearchInput />

      {/* Vendor Lists */}
      {loading || searchLoading ? (
        <SkeletonVendorList />
      ) : (searchedVendors?.length > 0 || (searchQuery && searchQuery.trim() !== "")) ? (
        searchedVendors?.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {searchedVendors.map((vendor) => (
              <VendorItem
                key={vendor?.v_id}
                vendor={vendor}
                setShowRejectModal={setShowRejectModal}
                loadingMore={loadingMore}
                activeTab={activeTab}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-danger font-semibold">
            <NoDataFound />
          </div>
        )
      ) : vendors && vendors?.length > 0 ? (
        <div className="space-y-4 animate-fade-in">
          {vendors?.map((vendor, index) => {
            const isLast = index === vendors?.length - 1;

            return (
              <VendorItem
                key={vendor?.v_id}
                ref={isLast ? lastVendorRef : null}
                vendor={vendor}
                setShowRejectModal={setShowRejectModal}
                loadingMore={loadingMore}
                activeTab={activeTab}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center text-danger font-semibold">
          <NoDataFound />
        </div>
      )}

      <RejectCommentModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
      />

      {loadingMore && <CustomLoader />}
    </div>
  );
};

export default AdminVendorPage;
