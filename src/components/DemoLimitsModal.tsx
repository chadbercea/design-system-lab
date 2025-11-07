'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

interface DemoLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoLimitsModal({ isOpen, onClose }: DemoLimitsModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti when modal opens
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Fire from two sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black/90 backdrop-blur-md border border-zinc-700 rounded-lg shadow-2xl max-w-md w-full mx-8 p-8 animate-in zoom-in-95 duration-300">
        {/* Docker Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-zinc-800/50 p-4 rounded-full">
            <img
              src="/design-system-lab/docker-image-runner/docker-logo.svg"
              alt="Docker"
              className="h-16 w-16"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          You've Found the Limits! 🎉
        </h2>

        {/* Message */}
        <p className="text-zinc-300 text-center mb-6 leading-relaxed">
          You've discovered the edge of this demo! Next, we'll try hooking this up to the API and see what we can do!
        </p>

        {/* Fun fact */}
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 mb-6">
          <p className="text-xs text-zinc-400 text-center italic">
            "The best way to predict the future is to implement it."
          </p>
        </div>

        {/* Dismiss Button */}
        <Button
          onClick={onClose}
          className="w-full bg-zinc-600 hover:bg-zinc-700 text-white font-medium"
        >
          Got it!
        </Button>
      </div>
    </div>
  );
}
