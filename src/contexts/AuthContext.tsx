'use client';

/**
 * Authentication Context Provider
 * Manages global authentication state across the application
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthContextType,
  DockerHubCredentials,
  AuthResponse,
  AuthStatusResponse,
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check authentication status on mount
   */
  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data: AuthStatusResponse = await response.json();

      setIsAuthenticated(data.authenticated);
      setUsername(data.username);
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setIsAuthenticated(false);
      setUsername(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with Docker Hub credentials
   */
  const login = async (credentials: DockerHubCredentials): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user) {
        setIsAuthenticated(true);
        setUsername(data.user.username);
      }

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout and clear session
   */
  const logout = async () => {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      setIsAuthenticated(false);
      setUsername(undefined);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const value: AuthContextType = {
    isAuthenticated,
    username,
    login,
    logout,
    checkStatus,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
