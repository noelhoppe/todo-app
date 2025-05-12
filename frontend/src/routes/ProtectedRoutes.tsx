import { Navigate, Outlet, Route, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";

/**
 * Gets mounted 
 * @returns 
 */
function ProtectedRoute() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean|null>(null);

  useEffect(() => {
    const checkAuthStatus = async() => {
      const status: boolean = await isAuthenticated();
      setIsUserAuthenticated(status);
      if (!status) {
        navigate("/login/", {replace: true})
      }
    }
    checkAuthStatus();
  }, []) // on mount

  if (isUserAuthenticated == null) {
    return null;
  }

  return <Outlet />
}

export default ProtectedRoute;