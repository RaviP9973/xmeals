import React, { useRef, useState } from "react";
import useOnClickOutside from "../hooks/useOnCllickOutside";

const ImageModal = ({ src, alt = "Image" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });
  return (
    <>
      {/* Thumbnail Image */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true)
        }}
        className="w-32 h-32 cursor-pointer object-cover rounded-lg shadow-md transition duration-300"
      />

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={(e) => {
              // setImageClicked(true);
              e.stopPropagation();
            }}
        >
          <div className="relative max-w-3xl w-full p-4">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 transition"
            >
              &times;
            </button>

            {/* Full Image */}
            <img
              src={src}
              alt={alt}
              className="w-full h-auto rounded-xl shadow-xl border-4 border-white"
              ref={ref}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;
