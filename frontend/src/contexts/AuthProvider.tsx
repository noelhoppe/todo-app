import { createContext } from "react";
import { fetchLogin } from "../services/auth";
import type  { AuthContext as AuthContextType, LoginRequest, LoginResponse, LoginSuccess } from "../types/auth";

const AuthContext = createContext<AuthContextType|null>(null);

function AuthProvider({children}: {children: React.ReactNode}) {
  const login = async(credentials: LoginRequest): Promise<LoginSuccess> => {
    const loginResponseData: LoginResponse = await fetchLogin(credentials);
    return loginResponseData
  }
  // TODO: Logout
  return (
    <AuthContext.Provider value={{login: login}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
export {
  AuthContext
}