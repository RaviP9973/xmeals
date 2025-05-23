import { useState } from "react";
import {
  FaHeart,
  FaStar,
  FaSearch,
  FaPlus,
  FaFilter,
  FaChevronDown,
  FaMinus,
} from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { LiaCartPlusSolid } from "react-icons/lia";
import { IoLocationSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";

export default function VendorDetails() {
  const [showBottomPopup, setShowBottomPopup] = useState(false);

  const [count, setCount] = useState(0);

  return (
    <div className="mx-auto text-gray-800">
      {/* Top Info */}

      <div className="bg-white w-screen rounded-b-3xl shadow-sm mb-2">
        <div className="w-3/4 flex flex-col mx-auto py-5">
          <div className="flex justify-between items-center mb-4 ">
            <div>
              <h1 className="text-xl font-bold">Vendor Name</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <IoLocationSharp className="text-sm text-pink" /> 2.6 km •{" "}
                <FaRegClock className="font-bold" /> 20–25 mins
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button className="bg-gray-200 aspect-square w-10 rounded-full flex items-center justify-center">
                <FaHeart
                  className="text-xl text-pink cursor-pointer hover:scale-105 transition-all duration-150"
                  size={18}
                />
              </button>

              <div className="text-sm text-gray-600">
                Rating: <span className="font-semibold">4.9</span>
              </div>

              <button>
                
              </button>

            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-sm rounded-lg border-2 border-gray-200 ">
              Sort by <FaChevronDown className="inline ml-1" />
            </button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-sm rounded-lg border-2 border-gray-200 ">
              Price: Low to High
            </button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-sm rounded-lg border-2 border-gray-200 ">
              Price: High to Low
            </button>
          </div>
        </div>
      </div>

      {/* Previously Ordered */}
      <div className="w-3/4 mx-auto  mb-4">
        <h2 className="text-lg font-semibold mb-2">Previously Ordered</h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-150"
              onClick={() => setShowBottomPopup(true)}
            >
              <img
                src="https://placehold.co/600x400"
                className="w-24 h-24 bg-gray-100 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-md font-bold">Item Name</h3>
                    <p className="text-gray-500">₹210</p>
                    <div className="text-xs text-gray-400">
                      description...{" "}
                      <span className="underline cursor-pointer">see more</span>
                    </div>
                  </div>
                  <button className="bg-primary text-white px-3 rounded-lg shadow hover:bg-[#0062cc] transition flex items-center justify-center gap-2 h-10">
                    Add <FaPlus className=" text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Menu */}
        <div className="w-full mt-8 flex items-center  justify-betwee py-3">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Search in Name"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-400 focus:border-dark/50 outline-none"
            />
            <button className="px-4 py-2 border-2 border-gray-400 rounded-lg text-sm hover:bg-gray-300 flex gap-1 items-center justify-center">
              <MdRestaurantMenu /> Menu
            </button>
          </div>
          {/* <div className="ml-4 text-sm text-gray-500 flex items-center justify-center"><LiaCartPlusSolid/> Cart </div> */}
        </div>

        {/* Bottom Popup */}
        {showBottomPopup && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="w-full max-w-xl bg-white p-4 rounded-xl shadow-xl animate-slide-up">
              <div className="flex justify-between items-center mb-2">
                {/* veg */}
                <div className="text-sm w-6 aspect-square border-green border-2 flex items-center justify-center">
                  <div className="w-3 aspect-square rounded-full bg-green"></div>
                </div>
                <button
                  onClick={() => setShowBottomPopup(false)}
                  className="text-xl font-bold"
                >
                  &times;
                </button>
              </div>
              {/* name */}
              <div className="mb-2 font-semibold">Item Name</div>
              {/* description */}
              <p className="text-sm text-gray-500 mb-4">
                Item description goes here...
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 border rounded px-2 py-1">
                  <button
                    onClick={() => {
                      if (count > 0) {
                        setCount(count - 1);
                      }
                    }}
                  >
                    <FaMinus className="text-sm font-semibold"/>
                  </button>
                  <span> {count} </span>
                  <button 
                  onClick={ 
                    () => {
                      setCount(count+1);
                    }
                  }
                  >
                    <FaPlus  className="text-sm font-semibold"/>
                  </button>
                </div>
                <button className="bg-[#007bff] text-white px-4 py-2 rounded-lg shadow hover:bg-[#0062cc] transition">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
