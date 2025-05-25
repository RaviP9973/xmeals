export const getReferralCode = async () => {
  //   const referralLink = `${window.location.origin}/login/`;
  const user = await supabase.auth.getUser();
  console.log(user);
  const { data: userDetails, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.data.user.id)
    .single();

  console.log("userDetails", userDetails);
  //   setReferralCode(userDetails.referral_code);
  return userDetails.referral_code;
};
