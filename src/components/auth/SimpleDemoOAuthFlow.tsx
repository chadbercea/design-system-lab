'use client';

/**
 * Simplified Demo OAuth Flow using shadcn/ui components
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SimpleDemoOAuthFlowProps {
  isOpen: boolean;
  onSuccess: (username: string) => void;
  onCancel: () => void;
}

type FlowStep = 'redirect' | 'docker-hub' | 'success';

export default function SimpleDemoOAuthFlow({ isOpen, onSuccess, onCancel }: SimpleDemoOAuthFlowProps) {
  const [step, setStep] = useState<FlowStep>('redirect');

  // Auto-progress through steps
  useEffect(() => {
    if (!isOpen) return;

    const timings = {
      redirect: 1000,
      'docker-hub': 1500,
      success: 800,
    };

    const timeout = setTimeout(() => {
      if (step === 'redirect') setStep('docker-hub');
      else if (step === 'docker-hub') setStep('success');
      else if (step === 'success') onSuccess('demo-user');
    }, timings[step]);

    return () => clearTimeout(timeout);
  }, [step, onSuccess, isOpen]);

  // Reset step when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep('redirect');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🐳</span>
            <DialogTitle>Docker Hub OAuth</DialogTitle>
          </div>
          <DialogDescription>
            Simulated authentication flow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'redirect' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Redirecting to Docker Hub...</h3>
                <p className="text-sm text-muted-foreground">
                  Opening secure authentication window
                </p>
              </div>
            </div>
          )}

          {step === 'docker-hub' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Docker Hub Login</h3>
                <p className="text-sm text-muted-foreground">Authenticating...</p>
              </div>

              <div className="space-y-3 bg-muted/50 p-4 rounded-lg border-2 border-dashed">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Docker ID or Email</label>
                  <div className="h-10 px-3 rounded-md border bg-background flex items-center">
                    <span className="text-muted-foreground">demo-user@example.com</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="h-10 px-3 rounded-md border bg-background flex items-center">
                    <span className="text-muted-foreground">••••••••</span>
                  </div>
                </div>
                <Button className="w-full" disabled>
                  Signing in...
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connected!</h3>
                <p className="text-sm text-muted-foreground">
                  Your Docker Hub account is now connected
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <Badge variant="outline">Demo Mode</Badge>
          <span>Simulated OAuth flow for demonstration</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
