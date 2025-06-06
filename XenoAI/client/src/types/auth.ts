/**
 * User interface
 */
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date | string;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

/**
 * JWT payload interface
 */
export interface JwtPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

/**
 * Auth context interface
 */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}