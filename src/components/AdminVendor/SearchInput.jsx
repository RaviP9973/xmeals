import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { searchVendors } from "../../utils/vendor";
import { useToast } from "../customtoast/CustomToast";
import { useVendor } from "../../context/vendorContext";

const SearchInput = () => {

  const { setsearchedVendors,searchQuery, setSearchQuery,searchLoading, setSearchLoading} = useVendor();
  const { showToast } = useToast();
  const [showSuggestions,setShowSuggestions] = useState(false);
  const inputRef = useRef();
  const containerRef = useRef();
  

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      const query = searchQuery.trim();

      // If input is all digits, treat as mobile number
      if (/^\d+$/.test(query)) {
        if (query.length !== 10) {
          setsearchedVendors([]);
          setShowSuggestions(false);
          setSearchLoading(false);
          return;
        }
      } else {
        // For name, if empty, don't search
        if (query === "") {
          setsearchedVendors([]);
          setShowSuggestions(false);
          setSearchLoading(false);
          return;
        }
      }
      setShowSuggestions(true);
      const { success, error, data } = await searchVendors(searchQuery);

      if (error || !success) {
        console.error(error);
        showToast("Error while searching Vendors");
        setsearchedVendors([]);
        setSearchLoading(false);
        return;
      }

      setsearchedVendors(data);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // To keep suggestion box width same as input
  const [inputWidth, setInputWidth] = useState(0);
  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [inputRef.current, searchQuery]);

  return (
    <div ref={containerRef} className="relative mb-8 flex justify-center">
      <FaSearch className="absolute left-5 sm:left-4 top-3.5 text-gray" />
      <input
        ref={inputRef}
        value={searchQuery}
        type="text"
        placeholder="Search by Name/Number"
        className="w-full pl-11 pr-4 py-2 rounded-lg border-1 border-gray text-dark
        focus:outline-none focus:border-gray-dark focus:border-2 transition-all duration-200"
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
      />

      {/* {showSuggestion && searchedVendors?.length !== 0 && (
        <div
          className="absolute left-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto overflow-x-hidden flex-wrap divide-y divide-gray-100 scrollbar-hide"
          style={{
            top: inputRef.current ? inputRef.current.offsetHeight + 8 : 48, // 8px gap below input
            width: inputWidth || "100%",
          }}
        >
          <h3 className="text-lg font-semibold mb-3 px-4 pt-3">
            Search Results
          </h3>
          <ul className="space-y-2 px-2 pb-2">
            {searchedVendors?.map((vendor, index) => (
<li
  key={vendor?.v_id}
  className="flex items-center gap-3 bg-gray-50 p-3 rounded-md cursor-pointer hover:shadow-sm transition-all duration-200"
>
  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
    <img
      src={vendor?.banner_url || "/placeholder.png"}
      alt={vendor?.shop_name}
      className="w-full h-full object-cover"
    />
  </div>
  <div className="flex-1">
    <h4
      className="font-medium text-gray-800 truncate max-w-[180px] whitespace-nowrap"
      title={vendor?.shop_name}
    >
      {vendor?.shop_name}
    </h4>
  </div>
</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default SearchInput;
