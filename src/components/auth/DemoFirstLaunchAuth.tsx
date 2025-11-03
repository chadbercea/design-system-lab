'use client';

/**
 * DEMO First Launch Authentication
 *
 * Simplified demo version that shows OAuth flow simulation.
 * For MVP demonstration purposes only.
 */

import React, { useState, useEffect } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import DemoOAuthFlow from './DemoOAuthFlow';

export default function DemoFirstLaunchAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOAuthFlow, setShowOAuthFlow] = useState(false);
  const { isAuthenticated, login, isLoading } = useDemoAuth();

  useEffect(() => {
    // Check if this is first launch
    const hasSeenAuthPrompt = localStorage.getItem('demo_auth_prompt_shown');

    // Show modal if user hasn't seen it and isn't authenticated
    if (!hasSeenAuthPrompt && !isAuthenticated && !isLoading) {
      setIsOpen(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleConnectToDockerHub = () => {
    setShowOAuthFlow(true);
  };

  const handleOAuthSuccess = async (username: string) => {
    await login(username);
    localStorage.setItem('demo_auth_prompt_shown', 'true');
    setShowOAuthFlow(false);
    setIsOpen(false);
  };

  const handleOAuthCancel = () => {
    setShowOAuthFlow(false);
  };

  const handleSkip = () => {
    localStorage.setItem('demo_auth_prompt_shown', 'true');
    setIsOpen(false);
  };

  // Show OAuth flow simulation
  if (showOAuthFlow) {
    return <DemoOAuthFlow onSuccess={handleOAuthSuccess} onCancel={handleOAuthCancel} />;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Demo Mode Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2">
          <p className="text-sm text-center text-gray-900 font-medium">
            🎭 Demo Mode - Simulated Authentication Flow
          </p>
        </div>

        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🐳</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Connect to Docker Hub
              </h2>
              <p className="text-sm text-gray-600">
                Access your images and registries
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Sign in to Docker Hub to access your private repositories and registries, or skip to use public images only.
          </p>

          {/* Benefits */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 space-y-2">
            <p className="text-sm font-semibold text-blue-900 mb-2">With Docker Hub, you can:</p>
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Pull images from private repositories</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Push and manage your containers</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Access team repositories</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConnectToDockerHub}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect with OAuth
            </button>

            <button
              onClick={handleSkip}
              className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Skip for now
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              You can always connect later in Settings
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>
              This demo simulates the Docker Hub OAuth authentication flow.
              In production, users will be redirected to Docker Hub for secure authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
