import React from "react";

const SkeletonOfferBannerList = () => {
  // Show 4 skeleton cards per row for desktop, adjust as needed
  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-lg border border-orange-100 p-4 flex flex-col items-center animate-pulse"
        >
          <div className="w-full h-40 bg-orange-100 rounded-xl mb-4 border" />
          <div className="w-full">
            <div className="h-3 w-1/2 bg-orange-100 rounded mb-2" />
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 bg-orange-100 rounded w-2/3" />
              <div className="flex gap-2 ml-auto">
                <div className="h-7 w-12 bg-orange-100 rounded" />
                <div className="h-7 w-14 bg-orange-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonOfferBannerList;