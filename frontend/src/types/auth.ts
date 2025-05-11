// --- REQUEST ---
type LoginRequest = {
  username: string;
  password: string;
}

// --- RESPONSE ---
type LoginSuccess = {
  message: string
};

type LoginFailure = {
  detail: string;
};

type LoginResponse = LoginSuccess | LoginFailure;

// --- CONTEXT
type AuthContext = {
  login: (credentials: LoginRequest) => Promise<LoginSuccess>;
}

export type {
  LoginRequest,
  LoginSuccess,
  LoginFailure,
  LoginResponse,
  AuthContext
};