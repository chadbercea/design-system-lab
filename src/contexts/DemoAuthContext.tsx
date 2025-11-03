'use client';

/**
 * DEMO Authentication Context
 *
 * This is a SIMULATED authentication system for MVP demo purposes.
 * No real Docker Hub API calls are made.
 *
 * For real implementation, replace with actual OAuth provider.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface DemoAuthContextType {
  isAuthenticated: boolean;
  username?: string;
  email?: string;
  login: (username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isDemo: true; // Flag to indicate this is demo mode
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

/**
 * Demo authentication provider
 * Uses localStorage for demo persistence
 */
export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo auth state from localStorage on mount
  useEffect(() => {
    const demoAuth = localStorage.getItem('demo_auth');
    if (demoAuth) {
      try {
        const { username: savedUsername, email: savedEmail } = JSON.parse(demoAuth);
        setUsername(savedUsername);
        setEmail(savedEmail);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse demo auth:', error);
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Simulate login with any username
   * In demo mode, any non-empty username is valid
   */
  const login = useCallback(async (demoUsername: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Validate input
    if (!demoUsername || demoUsername.trim().length === 0) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Username cannot be empty',
      };
    }

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    // In demo mode, all usernames are valid
    const cleanUsername = demoUsername.trim();
    const demoEmail = `${cleanUsername}@dockerhub.demo`;

    // Save to localStorage for demo persistence
    localStorage.setItem('demo_auth', JSON.stringify({
      username: cleanUsername,
      email: demoEmail,
    }));

    setUsername(cleanUsername);
    setEmail(demoEmail);
    setIsAuthenticated(true);
    setIsLoading(false);

    return { success: true };
  }, []);

  /**
   * Simulate logout
   */
  const logout = useCallback(() => {
    localStorage.removeItem('demo_auth');
    setUsername(undefined);
    setEmail(undefined);
    setIsAuthenticated(false);
  }, []);

  const value: DemoAuthContextType = {
    isAuthenticated,
    username,
    email,
    login,
    logout,
    isLoading,
    isDemo: true,
  };

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

/**
 * Hook to use demo authentication
 */
export function useDemoAuth(): DemoAuthContextType {
  const context = useContext(DemoAuthContext);

  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }

  return context;
}
