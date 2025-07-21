export const getCurrentLocation = async (
  setLocation,
  setError,
  setSelectedAddress
) => {
  try {
    // console.log("yaha pe aaya ?")
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");

      // console.log("Yaha v ni aa rha h kya?")
      return {
        success: false,
        error: new Error("Geolocation not supported"),
      };
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentLoc(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

    const { latitude, longitude, accuracy } = position.coords;

    if (accuracy > 50) {
      setError("Location accuracy is too low (>10 meters).");
      // return; // Don't proceed further
    }

    const data = await getAddressFromLatLng(latitude, longitude);
    if (data instanceof Error) {
      throw new Error(`Failed to get address: ${data.message}`);
    }
    const address = data?.results[0].formatted_address;
    const areaName = data?.results[0].address_components.find(
      (component) =>
        component.types.includes("sublocality") ||
        component.types.includes("sublocality_level_1")
    )?.long_name;
    const cityName = data?.results[0].address_components.find(
      (component) =>
        component.types.includes("locality") ||
        component.types.includes("administrative_area_level_2")
    )?.long_name;

    let landmark = "";

    if (areaName && cityName) {
      landmark = `${areaName}, ${cityName}`;
    } else if (!areaName && cityName) {
      landmark = cityName;
    } else if (areaName && !cityName) {
      landmark = areaName;
    } else {
      landmark = "";
    }

    const add = {
      landmark: landmark,
      h_no: "NA",
      floor: "NA",
      lat: latitude,
      long: longitude,
    };

    // console.log("address", address);

    setLocation({
      name: address,
      lat: latitude,
      lng: longitude,
      accuracy,
      areaName: areaName,
      cityName: cityName,
      landmark: landmark,
    });
    setSelectedAddress((prev) => ({
      ...prev,
      landmark: add?.landmark,
      h_no: add?.h_no,
      floor: add?.floor,
      lat: add?.lat,
      long: add?.long,
      address_type: "NA",
    }));

    return {
      success: true,
      address: add,
      error: null,
    };
  } catch (error) {
    console.error("Error getting location", error);
    setError(`Error getting location: ${error.message}`);
    setLocation(null);
    return {
      success: false,
      error: error,
    };
    // throw error; // Rethrow so caller knows it failed
  }
};