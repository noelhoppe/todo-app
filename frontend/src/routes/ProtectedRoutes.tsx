import { Navigate, Outlet, Route } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    console.log("rendered");
    const checkAuthStatus = async() => {
      const status: boolean = await isAuthenticated();
      setIsUserAuthenticated(status);
    }
    checkAuthStatus();
  }, [])


  return (
    isUserAuthenticated ? <Outlet /> : <Navigate to={"/login"}/>
  );
}

export default ProtectedRoute;