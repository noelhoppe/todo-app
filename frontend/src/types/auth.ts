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
  login: (evt: React.MouseEvent, credentials: LoginRequest) => Promise<LoginResponse>;
}

export type {
  LoginRequest,
  LoginSuccess,
  LoginFailure,
  LoginResponse,
  AuthContext
};