/**
 * Types for user authentication and management
 */

/**
 * Represents a user in the application
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  
  /** User's email address */
  email: string;
  
  /** User's display name */
  name?: string;
  
  /** URL to the user's profile photo */
  photoURL?: string;
  
  /** When the user account was created */
  createdAt?: string;
  
  /** When the user last logged in */
  lastLoginAt?: string;
}

/**
 * Authentication credentials for login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data for new user sign-up
 */
export interface RegisterData extends LoginCredentials {
  name: string;
}

/**
 * Current authentication state
 */
export interface AuthState {
  /** Currently authenticated user, if any */
  user: User | null;
  
  /** Whether authentication is in progress */
  loading: boolean;
  
  /** Any error that occurred during authentication */
  error: string | null;
  
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
} 