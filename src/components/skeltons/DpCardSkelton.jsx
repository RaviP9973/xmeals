import React from "react";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`} />
);

const DpCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
    {/* Left Side - Image and Info */}
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Image Skeleton */}
      <Skeleton className="w-24 h-24 rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-48 rounded" />
        <Skeleton className="h-8 w-28 rounded mt-2" />
      </div>
    </div>
    {/* Right Side - Status and Actions */}
    <div className="space-y-2 text-right flex flex-col items-end w-full sm:w-auto">
      <Skeleton className="h-5 w-32 rounded" />
      <Skeleton className="h-4 w-28 rounded" />
      <div className="flex flex-wrap justify-between gap-2 pt-2">
        <Skeleton className="h-9 w-20 rounded" />
        <Skeleton className="h-9 w-20 rounded" />
        <Skeleton className="h-9 w-20 rounded" />
      </div>
    </div>
  </div>
);

export default DpCardSkeleton;