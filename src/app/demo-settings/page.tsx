'use client';

/**
 * DEMO Settings Page
 * Shows simulated Docker Hub authentication management
 */

import React, { useState } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import DemoOAuthFlow from '@/components/auth/DemoOAuthFlow';

export default function DemoSettingsPage() {
  const { isAuthenticated, username, email, logout } = useDemoAuth();
  const [showOAuthFlow, setShowOAuthFlow] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleConnect = () => {
    setShowOAuthFlow(true);
  };

  const handleOAuthSuccess = async (demoUsername: string) => {
    setShowOAuthFlow(false);
    setSuccessMessage('Successfully connected to Docker Hub!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleOAuthCancel = () => {
    setShowOAuthFlow(false);
  };

  const handleSignOut = () => {
    logout();
    setSuccessMessage('Successfully signed out');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Show OAuth flow
  if (showOAuthFlow) {
    return <DemoOAuthFlow onSuccess={handleOAuthSuccess} onCancel={handleOAuthCancel} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Demo Mode Banner */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg px-4 py-3 shadow-md">
          <div className="flex items-center justify-center gap-2 text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Demo Mode</span>
            <span className="hidden sm:inline">-</span>
            <span className="text-sm">Simulated authentication for MVP demonstration</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your Docker Hub connection and preferences</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Docker Hub Authentication Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🐳</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Docker Hub Connection</h2>
                <p className="text-blue-100 text-sm">OAuth Authentication</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isAuthenticated ? (
              <div className="space-y-4">
                {/* Authenticated State */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Connected as:</p>
                        <p className="text-xl font-bold text-gray-900">{username}</p>
                        <p className="text-sm text-gray-600">{email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-5 py-2.5 text-red-700 bg-red-50 border-2 border-red-300 rounded-lg hover:bg-red-100 transition-all font-medium shadow-sm hover:shadow-md"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold text-blue-900">Private Access</h3>
                    </div>
                    <p className="text-sm text-blue-800">Pull from private repositories</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold text-blue-900">Push Images</h3>
                    </div>
                    <p className="text-sm text-blue-800">Upload your containers</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold text-blue-900">Team Access</h3>
                    </div>
                    <p className="text-sm text-blue-800">Collaborate on projects</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Not Authenticated State */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300 rounded-lg p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Not Connected</p>
                        <p className="text-sm text-gray-600">Connect to access private repositories</p>
                      </div>
                    </div>
                    <button
                      onClick={handleConnect}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium whitespace-nowrap"
                    >
                      Connect with OAuth
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-900 mb-1">Limited Access</p>
                      <p className="text-sm text-yellow-800">
                        You can only pull public images until you connect to Docker Hub.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Settings Placeholder */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600">Additional application settings will be available here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
