import React, { useState } from "react";

const Pagination = ({ totalCount = 10, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // If total pages are less than or equal to 5, show all
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first, last, and current ± 1
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-100 py-4 flex justify-center gap-2 border-t border-gray-300 z-10">
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                page === currentPage
                  ? "bg-primary text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
