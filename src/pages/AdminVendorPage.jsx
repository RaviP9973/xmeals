import React, { useEffect, useState } from "react";
import VendorItem from "../components/VendorItem";
import {
  FaSearch,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaUserSlash,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

const data = [
  {
    id: 1,
    name: "Sollie",
    number: "551-769-9398",
    address: "PO Box 99110",
    timing: "7:20 PM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 2,
    name: "Aurelea",
    number: "711-598-1815",
    address: "17th Floor",
    timing: "2:18 PM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 3,
    name: "Dall",
    number: "320-531-3187",
    address: "PO Box 37221",
    timing: "11:08 PM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 4,
    name: "Kathye",
    number: "562-173-5958",
    address: "Apt 788",
    timing: "9:28 PM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 5,
    name: "Ilse",
    number: "616-366-0553",
    address: "PO Box 5323",
    timing: "4:24 PM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 6,
    name: "Kincaid",
    number: "486-236-4128",
    address: "Apt 1591",
    timing: "9:33 AM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 7,
    name: "Pia",
    number: "949-206-0973",
    address: "Suite 59",
    timing: "8:07 PM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 8,
    name: "Gustavus",
    number: "710-889-1118",
    address: "Suite 67",
    timing: "6:39 AM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 9,
    name: "Magdalen",
    number: "795-609-3401",
    address: "Suite 69",
    timing: "2:04 AM",
    image_url:"https://placehold.co/600x400"
  },
  {
    id: 10,
    name: "Juliane",
    number: "844-974-0987",
    address: "Room 1439",
    timing: "6:38 PM",
    image_url:"https://placehold.co/600x400"
  }
]; 

const data2 = [
  {
    id: 1,
    name: "Sollie",
    number: "551-769-9398",
    address: "PO Box 99110",
    timing: "7:20 PM",
    image_url:"https://placehold.co/600x400"
  },
];

const tabs = [
    { id: "existing", label: "Existing", icon: <FaUserCheck /> },
    { id: "requests", label: "Requests", icon: <FaUserClock /> },
    { id: "rejected", label: "Rejected", icon: <FaUserTimes /> },
    { id: "blocked", label: "Blocked", icon: <FaUserSlash /> },
  ];
const AdminVendorPage = () => {

  const location = useLocation();
  const [activeTab, setActiveTab] = useState( location.state?.defaultTab || "existing");
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(50);
  const pageSize = 10;

  const [searchQuery,setSearchQuery] = useState("");
// const location = useLocation();
// const defaultTab = location.state?.defaultTab || "pending";
//   useEffect(() => {
//   const fetchVendors = async () => {
//     const from = (currentPage - 1) * pageSize;
//     const to = from + pageSize - 1;

//     const { data, count, error } = await supabase
//       .from("vendors")
//       .select("*", { count: "exact" })
//       .range(from, to);

//     if (error) {
//       console.error("Error fetching vendors:", error);
//     } else {
//       setVendors(data);
//       setTotalCount(count);
//     }
//   };

//   fetchVendors();
// }, [currentPage]);



  const onTabChange = async () => {
    setLoading(true);
    try {
      //call api to fetch data according to the active tab
      // const response = await fetch(api params = activeTab)
      // count, data

      let response;
      if (activeTab === "existing") {
        response = data;
      } else {
        response = data2;
      }
      //   const response = data;
      setVendors(response);
    } catch (error) {
      console.error("error in fetching admin vendor page data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    onTabChange();
    // setVendors(response.data);
  }, [activeTab]);

  const handleSearch = (query) => {
    const filteredVendors = vendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(query.toLowerCase())
    );
    setVendors(filteredVendors);
  }

  return (
    <div className="p-6 min-h-screen mx-auto bg-gray-100 w-full md:max-w-3/4">
      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300
          ${
            activeTab === tab.id
              ? "bg-primary text-white shadow-md scale-[1.02]"
              : "bg-light text-gray-dark hover:bg-[#e2e6ea]"
          }`}
          >
            {tab.icon}
            <span className="text-sm sm:text-base">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 flex justify-center">
        <FaSearch className="absolute left-5 sm:left-4 top-3.5 text-gray" />
        <input
          type="text"
          placeholder="Search by Name/Number"
          className="w-full pl-11 pr-4 py-2 rounded-lg border-1 border-gray text-dark
        focus:outline-none focus:border-gray-dark focus:border-2 transition-all duration-200"
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Handle search action
            console.log("Search query:", searchQuery);
            handleSearch(searchQuery);
          }
        }}
        />
      </div>

      {/* Vendor Lists */}
      {loading ? (
        <div className="text-center text-secondary font-medium">Loading...</div>
      ) : vendors && vendors.length > 0 ? (
        <div className="space-y-4 animate-fade-in">
          {vendors.map((vendor) => (
            <VendorItem
              key={vendor.id}
              vendor={vendor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-danger font-semibold">
          No data found
        </div>
      )}

      <div className="flex justify-center mt-6 gap-2">
        {Array.from(
          { length: Math.ceil(totalCount / pageSize) },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${
          page === currentPage
            ? "bg-[#007bff] text-white shadow"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }
      `}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminVendorPage;
