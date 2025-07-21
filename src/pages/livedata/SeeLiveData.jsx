import React, { useRef, useState, useEffect } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Circle,
    OverlayView,
} from "@react-google-maps/api";
import {
    FaMotorcycle,
    FaShoppingCart,
    FaUserCheck,
    FaUserTimes,
} from "react-icons/fa";
import { useToast } from "../../components/customtoast/CustomToast";
import Loader from "../../components/Loader";
import { useLiveMapData } from "../../utils/useLiveMapData";
import { LocateFixedIcon } from "lucide-react";

const MAP_WIDTH = "80vw";
const MAP_HEIGHT = "70vh";
const containerStyle = {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
};
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 4;
const RADIUS_KM = 10;

export default function LiveMapPage() {
    const { showToast } = useToast();

    const [searchInput, setSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationLoaded, setLocationLoaded] = useState(false);

    const autocompleteService = useRef(null);
    const placesService = useRef(null);
    const suggestionRef = useRef(null);
    const inputRef = useRef();

const libraries = ["places"]; // <-- Move this OUTSIDE your component

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries, // <-- use the reference, not a new array
});

    // On mount: fetch current geo location
    useEffect(() => {
        if (!selectedLocation && !locationLoaded) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setSelectedLocation({
                        label: "",
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLocationLoaded(true);
                },
                () => {
                    showToast("Please allow location permissions!", "error");
                    setLocationLoaded(true);
                }
            );
        }
    }, [selectedLocation, locationLoaded, showToast]);

    // Autocomplete setup
    useEffect(() => {
        if (!isLoaded) return;
        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
    }, [isLoaded]);

    // Suggestion fetch on input
    useEffect(() => {
        if (
            !autocompleteService.current ||
            !searchInput ||
            searchInput.length < 2
        ) {
            setSuggestions([]);
            return;
        }
        autocompleteService.current.getPlacePredictions(
            { input: searchInput },
            (preds, status) => {
                if (
                    status === window.google.maps.places.PlacesServiceStatus.OK &&
                    preds
                ) {
                    setSuggestions(preds);
                } else {
                    setSuggestions([]);
                }
            }
        );
    }, [searchInput]);
    useOnClickOutside(suggestionRef, () => setSuggestions([]));

    // Suggestion click handler
    const handleSuggestionClick = (suggestion) => {
        setSuggestions([]);
        if (!placesService.current && window.google && window.google.maps) {
            const map = new window.google.maps.Map(document.createElement("div"));
            placesService.current = new window.google.maps.places.PlacesService(map);
        }
        placesService.current.getDetails(
            { placeId: suggestion.place_id },
            (place, status) => {
                if (
                    status === window.google.maps.places.PlacesServiceStatus.OK &&
                    place &&
                    place.geometry &&
                    place.geometry.location
                ) {
                    setSelectedLocation({
                        label: suggestion.description,
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    });
                    setSearchInput('');
                } else {
                    showToast("Could not get place location", "error");
                }
            }
        );
    };

    // Get all map data (orders, dps, vendors, loading flags) for currently selected location
    const {
        ordersWithCoords,
        dpWithCoords,
        availVendorCoords,
        unavailVendorCoords,
        loading,
        loadingDps,
        loadingVendors,
    } = useLiveMapData(selectedLocation, showToast);

    let mapCenter = selectedLocation || DEFAULT_CENTER;
    let mapZoom = selectedLocation ? 13 : DEFAULT_ZOOM;

    function getPixelPositionOffset(width, height) {
        return { x: -(width / 2), y: -(height / 2) };
    }
    console.log(dpWithCoords);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full flex flex-col items-center">
                <div className="mt-6 mb-2" style={{ width: MAP_WIDTH }}>
                    <div className="flex flex-col relative w-full">
                        <div className="flex flex-row gap-2 w-full">
                            <input
                                ref={inputRef}
                                className="w-full text-sm lg:text-base bg-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                                style={{ width: "100%" }}
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search location (Google Places)"
                                autoFocus
                            />
                        </div>
                        {suggestions.length > 0 && (
                            <div
                                ref={suggestionRef}
                                className="absolute top-11 z-50 bg-white border border-gray-200 w-full rounded-md shadow-md mt-1 max-h-64 overflow-y-auto"
                            >
                                {suggestions.map(sugg => (
                                    <div
                                        key={sugg.place_id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSuggestionClick(sugg)}
                                    >
                                        {sugg.description}
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedLocation && selectedLocation.label !== '' && (
                            <div className="text-center w-full py-2 mt-1 mb-[-8px] text-black font-semibold rounded">
                                <span className="flex items-center justify-center gap-3"><LocateFixedIcon color="#fe4432" /> {selectedLocation.label}</span>
                            </div>
                        )}
                        {/* Entity Counts */}
                        <div className="flex items-center justify-center gap-8 mt-4 mb-2 text-base font-semibold">
                            <span className="flex items-center gap-2">
                                <FaUserCheck size={18} color="#17B300" />
                                Vendors (Available): {availVendorCoords.length}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaUserTimes size={18} color="red" />
                                Vendors (Unavailable): {unavailVendorCoords.length}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaMotorcycle size={18} color="green" />
                                DPs: {dpWithCoords.length}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaShoppingCart size={18} color="orange" />
                                Orders: {ordersWithCoords.length}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
            <div
                className="flex justify-center items-center"
                style={{
                    width: MAP_WIDTH,
                    margin: "0 auto",
                    overflow: "hidden",
                    borderRadius: "1.5rem",
                }}
            >
                <div style={{ width: "100%", height: MAP_HEIGHT }}>
                    {!isLoaded || loading || loadingDps || loadingVendors || !selectedLocation ? (
                        <div className="flex items-center justify-center h-full text-gray-600">
                            <Loader />
                            Loading map, location, orders, DPs and vendors...
                        </div>
                    ) : (
                        <GoogleMap
                            mapContainerStyle={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "1.5rem",
                                overflow: "hidden",
                            }}
                            center={mapCenter}
                            zoom={mapZoom}
                            options={{
                                gestureHandling: "greedy",
                                mapTypeControl: false,
                                streetViewControl: false,
                                fullscreenControl: false,
                                clickableIcons: false,
                            }}
                        >
                            {selectedLocation && (
                                <Circle
                                    center={selectedLocation}
                                    radius={10000}
                                    options={{
                                        fillColor: "#87CEFA",
                                        fillOpacity: 0.18,
                                        strokeColor: "#0099FF",
                                        strokeOpacity: 0.4,
                                        strokeWeight: 2,
                                        clickable: false,
                                        zIndex: 1,
                                    }}
                                />
                            )}
                            {dpWithCoords.map((dp, idx) => (
                                <OverlayView
                                    key={dp.dp_id || `dp-${idx}`}
                                    position={{ lat: dp.lat, lng: dp.long }}
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                    getPixelPositionOffset={getPixelPositionOffset}
                                >
                                    <FaMotorcycle size={30} color="green" style={{
                                        filter: "drop-shadow(0 1px 2px #555)",
                                        background: "white",
                                        borderRadius: "50%",
                                        padding: "3px"
                                    }} title="Delivery Partner" />
                                </OverlayView>
                            ))}
                            {ordersWithCoords.map((order, idx) => (
                                <OverlayView
                                    key={order.order_id || `order-${idx}`}
                                    position={{ lat: order.lat, lng: order.lng }}
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                    getPixelPositionOffset={getPixelPositionOffset}
                                >
                                    <FaShoppingCart size={30} color="orange" style={{
                                        filter: "drop-shadow(0 1px 2px #555)",
                                        background: "white",
                                        borderRadius: "50%",
                                        padding: "6px"
                                    }} title="Order" />
                                </OverlayView>
                            ))}
                            {/* Vendors: available - green check */}
                            {availVendorCoords.map((vendor, idx) => (
                                <OverlayView
                                    key={vendor.v_id || `v-green-${idx}`}
                                    position={{ lat: vendor.latitude, lng: vendor.longitude }}
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                    getPixelPositionOffset={getPixelPositionOffset}
                                >
                                    <FaUserCheck size={27} color="#17B300" style={{
                                        filter: "drop-shadow(0 1px 2px #555)",
                                        background: "white",
                                        borderRadius: "50%",
                                        padding: "3.5px"
                                    }} title="Available Vendor" />
                                </OverlayView>
                            ))}
                            {unavailVendorCoords.map((vendor, idx) => (
                                <OverlayView
                                    key={vendor.v_id || `v-red-${idx}`}
                                    position={{ lat: vendor.latitude, lng: vendor.longitude }}
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                    getPixelPositionOffset={getPixelPositionOffset}
                                >
                                    <FaUserTimes size={27} color="red" style={{
                                        filter: "drop-shadow(0 1px 2px #555)",
                                        background: "white",
                                        borderRadius: "50%",
                                        padding: "3.5px"
                                    }} title="Unavailable Vendor" />
                                </OverlayView>
                            ))}
                            {/* Center marker */}
                            {selectedLocation && (
                                <Marker
                                    position={selectedLocation}
                                    icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                    title={selectedLocation.label || "Selected location"}
                                />
                            )}
                        </GoogleMap>
                    )}
                </div>
            </div>
            {/* Map Legend */}
            <div className="max-w-4xl mx-auto flex gap-5 sm:gap-10 items-center justify-center mt-4 mb-2 text-sm">
                <span className="flex gap-2 items-center">
                    <FaShoppingCart size={20} color="orange" className="!inline" /> Order
                </span>
                <span className="flex gap-2 items-center">
                    <FaMotorcycle size={20} color="green" className="!inline" /> Delivery Partner
                </span>
                <span className="flex gap-2 items-center">
                    <FaUserCheck size={20} color="#17B300" className="!inline" />
                    Vendor (Available)
                </span>
                <span className="flex gap-2 items-center">
                    <FaUserTimes size={20} color="red" className="!inline" />
                    Vendor (Unavailable)
                </span>
                <span className="flex gap-2 items-center">
                    <img
                        src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        alt="Location"
                        className="w-4 h-4"
                    />
                    Selected Location
                </span>

            </div>
            {!loading && !loadingDps && !loadingVendors && selectedLocation &&
                availVendorCoords.length + unavailVendorCoords.length + ordersWithCoords.length + dpWithCoords.length === 0 && (
                    <div className="w-full text-center text-red-700 mt-4">
                        No vendors, orders, or delivery partners within {RADIUS_KM}km of this location.
                    </div>
                )}
        </div>
    );
}

// useOnClickOutside copied from your file or external util if needed
function useOnClickOutside(ref, handler) {
    useEffect(() => {
        function listener(event) {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        }
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [ref, handler]);
}
