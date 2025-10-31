"use client";

import { Button } from "@/components/ui/button";

export default function SentryExamplePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sentry Example Page</h1>
        <Button
          onClick={() => {
            throw new Error("Sentry Test Error");
          }}
        >
          Trigger Test Error
        </Button>
      </div>
    </div>
  );
}
