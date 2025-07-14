import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseclient";
import { useAuth } from "../context/authContext";
import Loader from "../components/Loader";
import NetworkError from "../components/NetworkError/NetworkError";
import { logout } from "../utils/auth";
import { TABLES } from "../constants/DBSchema";
// import { useUser } from "../context/userContext";

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { session, setSession } = useAuth();
  const [isRegistered, setIsRegistered] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);
  const MAX_RETRIES = 3;
  const [userRole, setUserRole] = useState(null);
  // const {userData} = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        // console.log("yaha pe aa v rha hu ")
        if (!navigator.onLine) {
          // setError("No internet connection");
          throw new Error("Network Error");
        }
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (!session) throw new Error("No session returned");

        console.log("yaha pe aa v rha hu");
        // if(!userDat)
        setSession(session);

        if (!userRole) {
          const { data, error: userError } = await supabase
            .from(TABLES?.USER)
            .select("role, is_admin")
            .eq("user_id", session?.user?.id);

          console.log("data", data);
          if (data[0]?.is_admin) await setUserRole(data[0]?.role);
        }

        const isReg = session?.user?.user_metadata?.isRegistered ?? false;
        setIsRegistered(isReg);
        setError(null);
      } catch (err) {
        console.log("error in private route", err);
        const isNetworkError =
          !navigator.onLine || err.message.includes("Network Error");

        if (isNetworkError && retryCount < MAX_RETRIES - 1) {
          setTimeout(() => setRetryCount((c) => c + 1), 3000);
          return;
        }

        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [retryCount, setSession]);

  // While loading, show loader
  if (isLoading) return <Loader />;

  // Network errors
  if (
    error &&
    (!navigator.onLine ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("Network Error"))
  ) {
    return <NetworkError />;
  }

  // No session = redirect to login
  if (!session) return <Navigate to="/login" replace />;

  // Session exists but user not registered = logout and redirect
  if (session && isRegistered === false) {
    logout(setSession); // this clears supabase + context
    return <Navigate to="/login" replace />;
    // or if you want to collect user details:
    // return <Navigate to="/userdetails" replace />;
  }

  if (userRole && userRole !== "Admin") {
    return <Navigate to="/adminRequestPending" replace />;
  }

  // All good
  if (session && isRegistered) {
    return <Outlet />;
  }

  // Fallback: defensive (shouldn't reach here)
  return <Navigate to={"/login"} />;
};

export default PrivateRoute;
