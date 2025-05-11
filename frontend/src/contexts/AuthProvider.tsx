import { createContext } from "react";
import { fetchIsAuthorized, fetchLogin } from "../services/auth";
import type  { AuthContext as AuthContextType, LoginRequest, LoginResponse, LoginSuccess } from "../types/auth";

const AuthContext = createContext<AuthContextType|null>(null);

function AuthProvider({children}: {children: React.ReactNode}) {
  const login = async(credentials: LoginRequest): Promise<LoginSuccess> => {
    // FIXME: Is this functiom usefull or is it better to include fetchLogin also in this function?
    const loginResponseData: LoginSuccess = await fetchLogin(credentials);
    return loginResponseData
  }

  const isAuthenticated = async(): Promise<boolean> => {
    try {
      await fetchIsAuthorized();
      return true;
    } catch(error) {
      if (error instanceof Error) {
        console.log(error);
      }
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{login: login, isAuthenticated: isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
export {
  AuthContext
}