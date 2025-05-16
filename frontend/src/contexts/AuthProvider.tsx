import { createContext } from "react";
import { fetchIsAuthorized, fetchLogin } from "../services/auth";
import type  { AuthContext as AuthContextType, LoginRequest, LoginResponse, LoginSuccess } from "../types/auth";

export const AuthContext = createContext<AuthContextType|null>(null);

export default function AuthProvider({children}: {children: React.ReactNode}) {
  const login = async(credentials: LoginRequest): Promise<LoginSuccess> => {
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