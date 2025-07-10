// components/EmptyCategoryNotice.jsx
import React from "react";

const EmptyCategoryNotice = ({ message = "No items in this category" }) => {
  return (
    <div className="p-4 text-gray-500 text-sm italic">
      {message}
    </div>
  );
};

export default EmptyCategoryNotice;