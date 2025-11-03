'use client';

/**
 * Simplified Demo Settings using shadcn/ui components
 */

import React, { useState } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SimpleDemoOAuthFlow from '@/components/auth/SimpleDemoOAuthFlow';

export default function SimpleDemoSettingsPage() {
  const { isAuthenticated, username, email, logout } = useDemoAuth();
  const [showOAuthFlow, setShowOAuthFlow] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleConnect = () => {
    setShowOAuthFlow(true);
  };

  const handleOAuthSuccess = async () => {
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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your Docker Hub connection and preferences
          </p>
        </div>

        {/* Demo Mode Banner */}
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="flex items-center gap-2 pt-6">
            <Badge variant="outline">🎭 Demo Mode</Badge>
            <p className="text-sm">Simulated authentication for MVP demonstration</p>
          </CardContent>
        </Card>

        {/* Success Message */}
        {successMessage && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardContent className="flex items-center gap-2 pt-6">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {successMessage}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Docker Hub Connection Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🐳</span>
              </div>
              <div>
                <CardTitle>Docker Hub Connection</CardTitle>
                <CardDescription>OAuth Authentication</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isAuthenticated ? (
              <>
                {/* Authenticated State */}
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 border-2 border-green-300 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Connected as:</p>
                      <p className="text-lg font-bold">{username}</p>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                  </div>
                  <Button onClick={handleSignOut} variant="destructive">
                    Sign Out
                  </Button>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-semibold">Private Access</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Pull from private repositories
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-semibold">Push Images</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Upload your containers
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-semibold">Team Access</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Collaborate on projects
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <>
                {/* Not Authenticated State */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted rounded-lg border-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Not Connected</p>
                      <p className="text-sm text-muted-foreground">
                        Connect to access private repositories
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleConnect}>
                    Connect with OAuth
                  </Button>
                </div>

                <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                  <CardContent className="flex items-start gap-3 pt-6">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium mb-1">Limited Access</p>
                      <p className="text-sm text-muted-foreground">
                        You can only pull public images until you connect to Docker Hub.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>

        {/* General Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Additional application settings will be available here.
            </p>
          </CardContent>
        </Card>
      </div>

      <SimpleDemoOAuthFlow
        isOpen={showOAuthFlow}
        onSuccess={handleOAuthSuccess}
        onCancel={handleOAuthCancel}
      />
    </div>
  );
}
