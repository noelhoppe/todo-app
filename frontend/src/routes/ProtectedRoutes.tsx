import { Navigate, Outlet, replace, Route, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean|null>(null);

  useEffect(() => {
    const checkAuthStatus = async() => {
      const status: boolean = await isAuthenticated();
      setIsUserAuthenticated(status);
    }
    checkAuthStatus();
  }, []) // on mount

  if (isUserAuthenticated == null) {
    return <p>Loading</p>;
  }

  if (isUserAuthenticated === false) {
    navigate("/login/", { replace: true })
  }
  
  return <Outlet />
}