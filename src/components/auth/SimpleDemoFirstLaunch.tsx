'use client';

/**
 * Simplified First Launch using shadcn/ui components
 */

import React, { useState, useEffect } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SimpleDemoOAuthFlow from './SimpleDemoOAuthFlow';

export default function SimpleDemoFirstLaunch() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOAuthFlow, setShowOAuthFlow] = useState(false);
  const { isAuthenticated, login, isLoading } = useDemoAuth();

  useEffect(() => {
    const hasSeenAuthPrompt = localStorage.getItem('demo_auth_prompt_shown');
    if (!hasSeenAuthPrompt && !isAuthenticated && !isLoading) {
      setIsOpen(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleConnect = () => {
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

  return (
    <>
      <Dialog open={isOpen && !showOAuthFlow} onOpenChange={(open) => !open && handleSkip()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🐳</span>
              </div>
              <div>
                <DialogTitle>Connect to Docker Hub</DialogTitle>
                <DialogDescription>Access your images and registries</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Badge variant="secondary" className="w-full justify-center py-2">
              🎭 Demo Mode - Simulated Authentication
            </Badge>

            <p className="text-sm text-muted-foreground">
              Sign in to Docker Hub to access your private repositories, or skip to use public images only.
            </p>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold">With Docker Hub, you can:</p>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pull from private repositories
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Push and manage containers
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Access team repositories
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={handleConnect} className="w-full">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect with OAuth
            </Button>
            <Button onClick={handleSkip} variant="outline" className="w-full">
              Skip for now
            </Button>
          </DialogFooter>

          <p className="text-xs text-center text-muted-foreground">
            You can always connect later in Settings
          </p>
        </DialogContent>
      </Dialog>

      <SimpleDemoOAuthFlow
        isOpen={showOAuthFlow}
        onSuccess={handleOAuthSuccess}
        onCancel={handleOAuthCancel}
      />
    </>
  );
}
