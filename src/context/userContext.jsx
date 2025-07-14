import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { TABLES } from "../constants/DBSchema";
import { logout } from "../utils/auth";
import { supabase } from "../supabaseclient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { session, setSession } = useAuth();

  useEffect( () => {
    if(!session) {
      setUserData(null);
    }
  },[])


  // Fetch user data on login/signup
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        const { data, error } = await supabase
          .from(TABLES?.USER)
          .select("*")
          .eq("user_id", session?.user?.id)
          .maybeSingle();

        if (!error) {
          // console.log("user", data);
          setUserData(data);
        } else {
          console.error("Error fetching user profile:", error.message);
        }
      }

      setLoading(false);
    };

    // Initial check
    if (session && session?.user?.user_metadata?.isRegistered) getUserData();

    // return () => listener.subscription.unsubscribe();
  }, [session]);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
export const useUser = () => useContext(UserContext);