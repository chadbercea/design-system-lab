/**
 * Authentication types for Docker Hub integration
 */

export interface DockerHubCredentials {
  username: string;
  token: string; // Personal Access Token or password
}

export interface DockerHubUser {
  username: string;
  verified: boolean;
  tokenExpiry?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  username?: string;
  encryptedToken?: string;
  tokenExpiry?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: DockerHubUser;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  username?: string;
  tokenExpiry?: string;
}

export interface DockerRegistryTokenResponse {
  token: string;
  access_token?: string;
  expires_in?: number;
  issued_at?: string;
}

export interface DockerHubUserInfo {
  id: string;
  username: string;
  full_name?: string;
  location?: string;
  company?: string;
  profile_url?: string;
  date_joined?: string;
  gravatar_url?: string;
  type?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  username?: string;
  login: (credentials: DockerHubCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkStatus: () => Promise<void>;
  isLoading: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  details?: string;
}
