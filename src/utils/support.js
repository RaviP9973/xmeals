import { COLUMNS, TABLES } from "../constants/DBSchema";
import { supabase } from "../supabaseclient";

//  Search user by mobile number
export const searchUserByNumber = async (number) => {
    const { data, error: fetchError } = await supabase
        .from(TABLES.USER)
        .select(`${COLUMNS.USER.ID},${COLUMNS.USER.MOBILE}, ${COLUMNS.USER.NAME}, ${COLUMNS.USER.DP_URL}`)
        .eq(COLUMNS.USER.MOBILE, number)
        .single();

    if (fetchError && fetchError.code !== "PGRST116") { // Not Found code is acceptable
        return { success: false, error: fetchError };
    }
    if (!data) {
        throw new Error("User not found");
    }

    return data;
};

//  Check if user is already in support team
export const checkIfInSupportTeam = async (userId) => {
    const { data, error } = await supabase
        .from(TABLES.SUPPORT_TEAM)
        .select(COLUMNS.SUPPORT_TEAM.USER_ID)
        .eq(COLUMNS.SUPPORT_TEAM.USER_ID, userId)
        .single();

    return !!data;
};

//  Add user to support team
export const addToSupportTeam = async (userId) => {
    await supabase.from(TABLES.SUPPORT_TEAM).insert([
        {
            user_id: userId,
            status: "available",
        },
    ]);
};

//  Remove user from support team
export const removeFromSupportTeam = async (userId) => {
    await supabase.from(TABLES.SUPPORT_TEAM).delete().eq(COLUMNS.SUPPORT_TEAM.USER_ID, userId);
};
