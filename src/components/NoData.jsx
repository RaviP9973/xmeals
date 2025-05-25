import { FaSearch } from "react-icons/fa";

const NoDataFound = ({ message = "No data found", iconSize = "3rem" }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <FaSearch className="text-gray-400 mb-4" style={{ fontSize: iconSize }} />
      <h2 className="text-xl font-semibold text-gray-600">{message}</h2>
      <p className="text-sm text-gray-500 mt-1">Please try adjusting your filters or search criteria.</p>
    </div>
  );
};

export default NoDataFound;
