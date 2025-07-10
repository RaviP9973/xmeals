import React from "react";

const SkeletonVendorCard = () => {
  return (
    <div className="animate-pulse rounded-2xl p-6 mb-6 bg-white shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Image Placeholder */}
        <div className="w-32 h-24 bg-gray-300 rounded-xl" />

        {/* Text Details */}
        <div className="space-y-2 w-full">
          <div className="h-5 bg-gray-300 rounded w-48" /> {/* Shop Name */}
          <div className="h-4 bg-gray-200 rounded w-36" /> {/* Vendor Name */}
          <div className="h-4 bg-gray-200 rounded w-40" /> {/* Phone */}
          <div className="h-4 bg-gray-200 rounded w-52" /> {/* Address */}
          <div className="h-4 bg-gray-200 rounded w-32" /> {/* Timing */}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-row sm:flex-col flex-wrap gap-3 mt-4 sm:mt-0">
        <div className="w-24 h-9 bg-gray-200 rounded-lg" /> {/* Edit */}
        <div className="w-24 h-9 bg-gray-200 rounded-lg" /> {/* Approve */}
        <div className="w-24 h-9 bg-gray-200 rounded-lg" /> {/* Reject */}
      </div>
    </div>
  );
};

const SkeletonVendorList = () => {
  return (
    <div>
      {[1, 2, 3].map((_, idx) => (
        <SkeletonVendorCard key={idx} />
      ))}
    </div>
  );
};

export default SkeletonVendorList;
