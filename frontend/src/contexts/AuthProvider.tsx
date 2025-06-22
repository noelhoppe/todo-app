import { createContext } from "react";
import { fetchIsAuthorized, fetchLogin, fetchLogout } from "../services/auth";
import type {
  AuthContext as AuthContextType,
  LoginRequest,
  LoginResponse,
  Success,
} from "../types/auth";

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const login = async (credentials: LoginRequest): Promise<Success> => {
    const loginResponseData: Success = await fetchLogin(credentials);
    return loginResponseData;
  };

  const logout = async (): Promise<Success> => {
    const logoutResponseData = await fetchLogout();
    return logoutResponseData;
  }

  const isAuthenticated = async (): Promise<boolean> => {
    try {
      await fetchIsAuthorized();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, isAuthenticated, logout}}
    >
      {children}
    </AuthContext.Provider>
  );
}
