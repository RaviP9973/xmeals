import { COLUMNS, TABLES } from "../constants/DBSchema";
import { supabase } from "../supabaseclient";

// Get all banners
export const getAllBanners = async () => {
    const { data, error } = await supabase
        .from(TABLES.LOGIN_BANNERS) // Assuming your table is named BANNERS
        .select(`${COLUMNS.LOGIN_BANNERS.ID}, ${COLUMNS.LOGIN_BANNERS.CREATED_AT}, ${COLUMNS.LOGIN_BANNERS.MOBILE_IMAGE_URL}, ${COLUMNS.LOGIN_BANNERS.PC_IMAGE_URL}, ${COLUMNS.LOGIN_BANNERS.LINK}`)
        .order(COLUMNS.LOGIN_BANNERS.CREATED_AT, { ascending: false });

    if (error) {
        return { success: false, error };
    }

    return { success: true, data };
};

// Get banner by ID
export const getBannerById = async (id) => {
    const { data, error } = await supabase
        .from(TABLES.LOGIN_BANNERS)
        .select(`${COLUMNS.LOGIN_BANNERS.ID}, ${COLUMNS.LOGIN_BANNERS.CREATED_AT}, ${COLUMNS.LOGIN_BANNERS.MOBILE_IMAGE_URL}, ${COLUMNS.LOGIN_BANNERS.PC_IMAGE_URL}, ${COLUMNS.LOGIN_BANNERS.LINK}`)
        .eq(COLUMNS.LOGIN_BANNERS.ID, id)
        .single();

    if (error) {
        return { success: false, error };
    }

    return { success: true, data };
};

// Add new banner
export const addBanner = async (bannerData) => {
    const { data, error } = await supabase
        .from(TABLES.LOGIN_BANNERS)
        .insert([
            {
                [COLUMNS.LOGIN_BANNERS.MOBILE_IMAGE_URL]: bannerData.mobile_image_url,
                [COLUMNS.LOGIN_BANNERS.PC_IMAGE_URL]: bannerData.pc_image_url,
                [COLUMNS.LOGIN_BANNERS.LINK]: bannerData.link,
            },
        ])
        .select();

    if (error) {
        return { success: false, error };
    }

    return { success: true, data };
};

// Update banner
export const updateBanner = async (id, bannerData) => {
    const updateData = {};
    
    if (bannerData.mobile_image_url !== undefined) {
        updateData[COLUMNS.LOGIN_BANNERS.MOBILE_IMAGE_URL] = bannerData.mobile_image_url;
    }
    if (bannerData.pc_image_url !== undefined) {
        updateData[COLUMNS.LOGIN_BANNERS.PC_IMAGE_URL] = bannerData.pc_image_url;
    }
    if (bannerData.link !== undefined) {
        updateData[COLUMNS.LOGIN_BANNERS.LINK] = bannerData.link;
    }

    const { data, error } = await supabase
        .from(TABLES.LOGIN_BANNERS)
        .update(updateData)
        .eq(COLUMNS.LOGIN_BANNERS.ID, id)
        .select();

    if (error) {
        return { success: false, error };
    }

    return { success: true, data };
};

// Delete banner
export const deleteBanner = async (id) => {
    const { data, error } = await supabase
        .from(TABLES.LOGIN_BANNERS)
        .delete()
        .eq(COLUMNS.LOGIN_BANNERS.ID, id)
        .select();

    if (error) {
        return { success: false, error };
    }

    return { success: true, data };
};

// Get active banners (assuming you have an active/status column)
export const getActiveBanners = async () => {
    const { data, error } = await supabase
        .from(TABLES.LOGIN_BANNERS)
        .select(`${COLUMNS.LOGIN_BANNERS.ID}, ${COLUMNS.LOGIN_BANNERS.CREATED_AT}, ${COLUMNS.LOGIN_BANNERS.MOBILE_IMAGE_URL}, ${COLUMNS.LOGIN_BANNERS.PC_IMAGE_URL}, ${COLUMNS.LOGIN_BANNERS.LINK}`)
        .eq(COLUMNS.LOGIN_BANNERS.STATUS, 'active') // Adjust if you have a status column
        .order(COLUMNS.LOGIN_BANNERS.CREATED_AT, { ascending: false });

    if (error) {
        return { success: false, error };
    }

    return { success: true, data };
};

// Helper function to get appropriate image URL based on device
export const getImageUrl = (banner, isMobile = false) => {
    if (!banner) return '';
    
    return isMobile 
        ? banner[COLUMNS.LOGIN_BANNERS.MOBILE_IMAGE_URL] || banner[COLUMNS.LOGIN_BANNERS.PC_IMAGE_URL]
        : banner[COLUMNS.LOGIN_BANNERS.PC_IMAGE_URL] || banner[COLUMNS.LOGIN_BANNERS.MOBILE_IMAGE_URL];
};

// Helper function to check if banner has valid images
export const hasValidImages = (banner) => {
    if (!banner) return false;
    
    return !!(banner[COLUMNS.LOGIN_BANNERS.MOBILE_IMAGE_URL] || banner[COLUMNS.LOGIN_BANNERS.PC_IMAGE_URL]);
};

// Helper function to check if banner has valid link
export const hasValidLink = (banner) => {
    if (!banner) return false;
    
    return !!(banner[COLUMNS.LOGIN_BANNERS.LINK] && banner[COLUMNS.LOGIN_BANNERS.LINK].trim() !== '');
};
// Upload image to Supabase Storage and return public URL
export const uploadBannerImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
  const filePath = `banners/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("banners") // ⬅️ Replace with your actual bucket name if different
    .upload(filePath, file);

  if (uploadError) {
    return { success: false, error: uploadError };
  }

  const { data: publicUrlData } = supabase.storage
    .from("banners")
    .getPublicUrl(filePath);

  return { success: true, url: publicUrlData.publicUrl };
};
