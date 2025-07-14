import React from "react";
import { FaUserTimes } from "react-icons/fa";

const NoDpFound = ({ tabLabel = "this tab" }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <FaUserTimes className="text-5xl mb-4" />
    <p className="text-lg font-semibold">No Delivery Partner found for <span className="text-primary">{tabLabel}</span></p>
  </div>
);

export default NoDpFound;