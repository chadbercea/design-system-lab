'use client';

/**
 * DEMO OAuth Flow Simulation
 *
 * Visual simulation of Docker Hub OAuth flow for MVP demo.
 * Shows what the real OAuth experience would look like.
 */

import React, { useState, useEffect } from 'react';

interface DemoOAuthFlowProps {
  onSuccess: (username: string) => void;
  onCancel: () => void;
}

type FlowStep = 'redirect' | 'docker-hub' | 'consent' | 'callback' | 'success';

export default function DemoOAuthFlow({ onSuccess, onCancel }: DemoOAuthFlowProps) {
  const [step, setStep] = useState<FlowStep>('redirect');
  const [progress, setProgress] = useState(0);

  // Auto-progress through steps
  useEffect(() => {
    const timings = {
      redirect: 1000,
      'docker-hub': 1500,
      consent: 2000,
      callback: 800,
      success: 500,
    };

    const timeout = setTimeout(() => {
      if (step === 'redirect') setStep('docker-hub');
      else if (step === 'docker-hub') setStep('consent');
      else if (step === 'consent') setStep('callback');
      else if (step === 'callback') setStep('success');
      else if (step === 'success') onSuccess('demo-user');
    }, timings[step]);

    return () => clearTimeout(timeout);
  }, [step, onSuccess]);

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm font-mono">
      <div className="bg-black/80 backdrop-blur-sm border border-zinc-700 rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-black/60 border-b border-zinc-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/docker-logo.svg" alt="Docker" className="w-10 h-10" />
              <div>
                <h2 className="text-white font-semibold text-lg">Docker Hub</h2>
                <p className="text-zinc-400 text-xs">OAuth Authorization</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-zinc-800">
          <div
            className="h-full bg-cyan-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'redirect' && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Redirecting to Docker Hub...</h3>
              <p className="text-zinc-400">Opening secure authentication window</p>
            </div>
          )}

          {step === 'docker-hub' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Sign in to Docker Hub</h3>
                <p className="text-zinc-400 text-sm">This is a simulation of the Docker Hub login page</p>
              </div>

              {/* Simulated Login Form */}
              <div className="space-y-3 bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Docker ID or Email
                  </label>
                  <div className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-black/40">
                    <span className="text-zinc-500">demo-user@example.com</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Password
                  </label>
                  <div className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-black/40">
                    <span className="text-zinc-500">••••••••</span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="w-full px-4 py-2 bg-cyan-600 text-white rounded-md text-center font-medium">
                    Signing in...
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'consent' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">Authorize Application</h3>
                <p className="text-zinc-400 text-sm">Grant access to your Docker Hub account</p>
              </div>

              {/* App Info */}
              <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/docker-logo.svg" alt="Docker" className="w-12 h-12" />
                  <div>
                    <p className="font-semibold text-white">Your Application</p>
                    <p className="text-sm text-zinc-400">wants to access your Docker Hub account</p>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-3 space-y-2">
                  <p className="text-sm font-medium text-white">This app will be able to:</p>
                  <ul className="space-y-1 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Read your profile information
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Access your repositories
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Pull and push images
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-md font-medium border border-zinc-700">
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-md font-medium">
                  Authorizing...
                </button>
              </div>
            </div>
          )}

          {step === 'callback' && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="animate-pulse">
                  <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Authorization Successful</h3>
              <p className="text-zinc-400">Returning to application...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connected!</h3>
              <p className="text-zinc-400">Your Docker Hub account is now connected</p>
            </div>
          )}
        </div>

        {/* Demo Badge */}
        <div className="bg-zinc-900/50 border-t border-zinc-700 px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Demo Mode:</span>
            <span>This is a simulated OAuth flow for demonstration purposes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
