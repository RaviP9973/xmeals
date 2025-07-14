import { supabase } from "../supabaseclient";
import { TABLES } from "../constants/DBSchema";

export const fetchAllOffers = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES?.OFFER_BANNER)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error(error);
      throw error;
    }

    return {
      success: true,
      error: null,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
      data: null,
    };
  }
};

export const uploadImageAndInsertOffer = async ({ image, link }) => {
  try {
    let image_url = "";
    if (image) {
      // 1. Upload to Supabase bucket
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("offer-banners") // your bucket name
        .upload(fileName, image);

      if (uploadError) {
        // alert("Image upload failed!");
        // return;
        throw uploadError;
      }

      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("offer-banners")
        .getPublicUrl(fileName);

      image_url = publicUrlData.publicUrl;
    }

    // 3. Insert into table
    const { data, error } = await supabase
      .from(TABLES.OFFER_BANNER)
      .insert([{ image_url, link }])
      .select();

    if (error) {
      //   alert("Failed to add offer!");
      throw error;
    }

    console.log("data", data);
    return {
      success: true,
      error: null,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error,
      data: null,
    };
  }
};

export const uploadOfferImageAndGetPublicUrl = async (image) => {
  try {
    const fileExt = image.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("offer-banners")
      .upload(fileName, image);

    console.log("after uploading image ");

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get public URL
    console.log("inside the uloader error");
    const { data: publicUrlData } = supabase.storage
      .from("offer-banners")
      .getPublicUrl(fileName);
    // image_url = publicUrlData.publicUrl;
    // console.log("new image url", image_url);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateOfferBanner = async (image_url, link, id) => {
  try {
    const { error } = await supabase
      .from(TABLES.OFFER_BANNER)
      .update({ link, image_url })
      .eq("id", id);

    console.log("after updating data to table");

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: null,
      error: null,
    };
    // console.log("yaha pe aya mai ", error);
    // toast.error("Failed to update banner");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error: error,
    };
  }
};

export const deleteBanner = async (id) => {
  try {
    const { error } = await supabase
      .from(TABLES.OFFER_BANNER)
      .delete()
      .eq("id", id);
    if (error) {
      // toast.error("Failed to delete banner");
      // return;
      throw error;
    }

    return {
      success:true,
      error:null
    };

  } catch (error) {
    console.error(error);
    return {
      success:false,
      error
    }
  }
};
