import { useState } from "react";

// Common country codes data
export const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+234", country: "NG", flag: "🇳🇬", name: "Nigeria" },
];

// Country Code Dropdown Component
export const CountryCodeDropdown = ({ selectedCountry, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm) ||
      country.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country) => {
    onSelect(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-4 bg-gray-50 border-2 border-gray-200 rounded-l-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none  min-w-[80px]"
      >
        <span className="text-lg mr-1">{selectedCountry.flag}</span>
        <span className="text-gray-700 font-medium text-sm">{selectedCountry.code}</span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none  text-sm"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <button
                  key={`${country.country}-${index}`}
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-150 flex items-center justify-between border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{country.flag}</span>
                    <div>
                      <span className="font-medium text-gray-800 text-sm">{country.name}</span>
                      <span className="text-gray-500 text-xs ml-2">({country.country})</span>
                    </div>
                  </div>
                  <span className="text-orange-600 font-medium text-sm">{country.code}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
