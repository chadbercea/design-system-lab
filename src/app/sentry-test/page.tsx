"use client";

import { Button } from "@/components/ui/button";

export default function SentryTestPage() {
  const throwError = () => {
    throw new Error("Test error from Sentry MCP integration!");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Sentry Test Page</h1>
      <p className="text-gray-600">Click the button below to trigger a test error</p>
      <Button onClick={throwError} variant="destructive">
        Trigger Test Error
      </Button>
    </div>
  );
}
