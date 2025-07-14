// utils/cuisine.js
// import { supabase } from "./supabaseClient";
import { supabase } from "../supabaseclient";
import { TABLES } from "../constants/DBSchema";
/**
 * Fetch all cuisines
 */
export const fetchAllCuisine = async (created_at = null, c_id = null, limit = 10) => {
  try {
    let query = supabase
      .from("item_category")
      .select("*")
      .order("created_at", { ascending: false }) // Newest first
      .order("c_id", {ascending:false});

    if (created_at !== null && c_id !== null) {
      // Fetch items with created_at less than the last fetched one
      query = query.or(
        `and(created_at.lt.${created_at}),and(created_at.eq.${created_at},c_id.lt.${c_id})`
      ); 
    }

    query = query.limit(limit);
    const { data, error } = await query;

    if (error) throw error;

    return {
      data,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error,
    };
  }
};

/**
 * Insert a new cuisine
 */
export const insertCuisine = async (cuisine, adminId) => {
  try {
    if (!adminId) {
      throw new Error("Only admins can add cuisines");
    }
    console.log(cuisine);
    const { data, error } = await supabase
      .from(TABLES?.ITEM_CATEGORY)
      .insert([
        {
          name: cuisine?.name,
          image_url: cuisine?.image_url,
          keywords: cuisine?.keywords, // array of strings
          admin_id: adminId,
        },
      ])
      .select();

      console.log("data",data);
    if (error) {
      console.log(error);
      throw error;
    }
    return {
      data,
      success: true,
      error:null
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error,
    };
  }
};

/**
 * Update existing cuisine
 */
export const updateCuisine = async (cuisine) => {
  const { data, error } = await supabase
    .from(TABLES?.ITEM_CATEGORY)
    .update({
      name: cuisine?.name,
      keywords: cuisine?.keywords,
      image_url: cuisine?.image_url,
    })
    .eq("c_id", cuisine?.c_id)
    .select();

  console.log("data", data);

  if (error) throw error;
  return data[0];
};

export const uploadImageToSupabase = async (file, admin_id) => {
  try {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("Please provide a valid image file.");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${admin_id}_${Math.random()}.${fileExt}`;
    const filePath = `${"uploads"}/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from("cuisine-images") // replace with your bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("cuisine-images")
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error("Image upload error:", err.message);
    return null;
  }
};

export const deleteCuisine = async (c_id) => {
  try {
    if (!c_id) {
      // return {
      //   success:false,
      //   data:null,
      //   error:
      // }

      throw new Error("Details Missing");
    }

    const { data, error } = await supabase
      .from(TABLES?.ITEM_CATEGORY)
      .delete()
      .eq('c_id',c_id);


    if (error) {
      throw error;
    }

    return {
      success: true,
      error: null,
      data,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
    };
  }
};
