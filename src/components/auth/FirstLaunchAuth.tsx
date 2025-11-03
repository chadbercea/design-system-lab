'use client';

/**
 * First Launch Authentication Modal
 * Shows on first app load, prompts for Docker Hub authentication
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function FirstLaunchAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Check if this is first launch
    const hasSeenAuthPrompt = localStorage.getItem('auth_prompt_shown');

    // Show modal if user hasn't seen it and isn't authenticated
    if (!hasSeenAuthPrompt && !isAuthenticated && !isLoading) {
      setIsOpen(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleSkip = () => {
    localStorage.setItem('auth_prompt_shown', 'true');
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login({ username, token });

    if (result.success) {
      localStorage.setItem('auth_prompt_shown', 'true');
      setIsOpen(false);
    } else {
      setError(result.error || 'Authentication failed. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect to Docker Hub
          </h2>
          <p className="text-gray-600">
            Sign in to access your Docker Hub images and registries, or skip to use public images only.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Docker Hub Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your-username"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Token Input */}
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
              Personal Access Token or Password
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="dckr_pat_..."
              required
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              <a
                href="https://hub.docker.com/settings/security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Create a Personal Access Token
              </a>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            Your credentials are encrypted and stored securely. We recommend using a Personal Access Token instead of your password.
          </p>
        </div>
      </div>
    </div>
  );
}
