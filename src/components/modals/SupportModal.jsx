import { useState } from "react";
import { supabase } from "../../supabaseclient";
import {
  searchUserByNumber,
  checkIfInSupportTeam,
  addToSupportTeam,
  removeFromSupportTeam,
} from "../../utils/support";
import { useToast } from "../customtoast/CustomToast";
import { countryCodes, CountryCodeDropdown } from "../Countrycode";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
  </div>
);


const SupportModal = ({ onClose }) => {
  const [number, setNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[3]); // Default to India
  const [found, setFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInSupport, setIsInSupport] = useState(false);
  const { showToast } = useToast();

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Combine country code with number
      const fullNumber = `${selectedCountry.code}${number}`;
      const userData = await searchUserByNumber(fullNumber);
      const isSupport = await checkIfInSupportTeam(userData.user_id);

      setFound(userData);
      setNumber("");
      showToast("User found", "success", "short");
      setIsInSupport(isSupport);
    } catch (err) {
      setFound(null);
      setIsInSupport(false);
      showToast(err.message, "error", "short");
    }
    setLoading(false);
  };

  const handleAddToSupport = async () => {
    await addToSupportTeam(found.user_id);
    showToast("Added to Support Team", "success", "short");
    setIsInSupport(true);
  };

  const handleRemoveFromSupport = async () => {
    await removeFromSupportTeam(found.user_id);
    showToast("Removed from Support Team", "error", "short");
    setIsInSupport(false);
  };

  const handleNumberChange = (e) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    setNumber(value);
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex justify-center items-center p-2 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 relative ">
    

        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Support Management</h2>
        </div>

        {!found && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="flex">
              <CountryCodeDropdown
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
              />
              <input
                type="text"
                value={number}
                onChange={handleNumberChange}
                placeholder="Enter mobile number"
                className="border-2 border-gray-200 border-l-0 p-2 flex-1 rounded-r-xl focus:outline-none  transition-all duration-300 text-gray-700 placeholder-gray-400 w-full"
              />
            </div>
           
          </div>
        )}

        {found && (
          <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200 shadow-inner">
            <div className="flex items-center mb-4">
              {found.dp_url ? (
                <img
                  src={found.dp_url}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-4 object-cover shadow-lg border-2 border-orange-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mr-4 flex items-center justify-center shadow-lg border-2 border-orange-200">
                  <span className="text-white font-bold text-xl">
                    {found.name ? found.name.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-xl">{found.name || "Unknown User"}</p>
                <p className="text-gray-600 text-sm">{found.mobile_number}</p>
              </div>
            </div>

            <div className={`flex items-center p-3 rounded-lg ${isInSupport ? 'bg-green-100 border border-green-200' : 'bg-yellow-100 border border-yellow-200'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${isInSupport ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <p className={`text-sm font-medium ${isInSupport ? 'text-green-700' : 'text-orange-700'}`}>
                {isInSupport ? "Already in support team" : "Not in support team"}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={found ? (isInSupport ? handleRemoveFromSupport : handleAddToSupport) : handleSearch}
          disabled={loading || (!found && !number.trim())}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl w-full mb-3 transition-all duration-300 transform hover:scale-101 active:scale-99 cursor-pointer disabled:hover:scale-100 shadow-lg hover:shadow-xl font-semibold"
        >
          {loading ? <LoadingSpinner /> : found ? (isInSupport ? "Remove from Support" : "Add to Support") : "Search User"}
        </button>

        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl w-full transition-all duration-300 font-semibold hover:shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SupportModal;