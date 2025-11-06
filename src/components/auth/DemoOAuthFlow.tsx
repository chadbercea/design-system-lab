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
  const [step, setStep] = useState<FlowStep>('docker-hub');
  const [progress, setProgress] = useState(0);

  // Auto-progress only for callback and success steps
  useEffect(() => {
    if (step === 'callback') {
      const timeout = setTimeout(() => setStep('success'), 800);
      return () => clearTimeout(timeout);
    } else if (step === 'success') {
      const timeout = setTimeout(() => onSuccess('demo-user'), 1500);
      return () => clearTimeout(timeout);
    }
  }, [step, onSuccess]);

  // Progress bar animation - starts on callback step
  useEffect(() => {
    if (step === 'callback') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md font-mono animate-in fade-in duration-300">
      <div className="bg-black/80 backdrop-blur-md border border-black rounded-lg shadow-2xl max-w-xl w-full mx-8 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-black/60 border-b border-black px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/design-system-lab/docker-logo.svg" alt="Docker" className="w-12 h-12" />
              <div>
                <h2 className="text-white font-semibold text-xl">Docker Hub</h2>
                <p className="text-zinc-400 text-sm">OAuth Authorization</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-black">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              opacity: progress >= 100 ? 0 : 1,
              transition: progress >= 100 ? 'opacity 0.5s ease-out' : 'all 0.3s ease-out'
            }}
          />
        </div>

        {/* Content */}
        <div className="p-12 relative">
          {step === 'redirect' && (
            <div className="text-center py-8 animate-in fade-in duration-500">
              <div className="mb-6 flex justify-center">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-white"></div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Redirecting to Docker Hub...</h3>
              <p className="text-zinc-400 text-base">Opening secure authentication window</p>
            </div>
          )}

          {step === 'docker-hub' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-3">Sign in to Docker Hub</h3>
                <p className="text-zinc-400">This is a simulation of the Docker Hub login page</p>
              </div>

              {/* Simulated Login Form */}
              <div className="space-y-4 bg-black/40 p-6 rounded-lg border border-black">
                <div>
                  <label className="block text-base font-medium text-zinc-300 mb-2">
                    Docker ID or Email
                  </label>
                  <div className="w-full px-4 py-3 border border-black rounded-md bg-black/40">
                    <span className="text-zinc-400">demo-user@example.com</span>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-zinc-300 mb-2">
                    Password
                  </label>
                  <div className="w-full px-4 py-3 border border-black rounded-md bg-black/40">
                    <span className="text-zinc-400">••••••••</span>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setStep('consent')}
                    className="w-full px-4 py-3 bg-zinc-600 hover:bg-zinc-700 text-white rounded-md text-center font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'consent' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white mb-3">Authorize Application</h3>
                <p className="text-zinc-400">Grant access to your Docker Hub account</p>
              </div>

              {/* App Info */}
              <div className="bg-black/40 border border-black rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img src="/design-system-lab/docker-logo.svg" alt="Docker" className="w-14 h-14" />
                  <div>
                    <p className="font-semibold text-white text-lg">Your Application</p>
                    <p className="text-zinc-400">wants to access your Docker Hub account</p>
                  </div>
                </div>

                <div className="border-t border-black pt-4 space-y-3">
                  <p className="font-medium text-white">This app will be able to:</p>
                  <ul className="space-y-2 text-zinc-300">
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Read your profile information
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Access your repositories
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Pull and push images
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-900 text-zinc-300 rounded-md font-medium border border-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('callback')}
                  className="flex-1 px-4 py-3 bg-zinc-600 hover:bg-zinc-700 text-white rounded-md font-medium transition-colors"
                >
                  Authorize
                </button>
              </div>
            </div>
          )}

          {step === 'callback' && (
            <div className="text-center py-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6 flex justify-center">
                <div className="animate-pulse">
                  <svg className="w-20 h-20 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Authorization Successful</h3>
              <p className="text-zinc-400 text-base">Returning to application...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Connected!</h3>
              <p className="text-zinc-400 text-base">Your Docker Hub account is now connected</p>
            </div>
          )}
        </div>

        {/* Demo Badge */}
        <div className="bg-black/40 border-t border-black px-8 py-4">
          <div className="flex items-center gap-3 text-zinc-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
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
