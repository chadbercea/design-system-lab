'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/app-state-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RotateCw, Pause, Square, Trash2, Save } from 'lucide-react';

type ActionType = 'restart' | 'pause' | 'stop' | 'remove' | 'persist' | null;

export function ActionsTab() {
  const { containerStatus, setContainerStatus, config } = useAppState();
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);

  // Action handlers
  const handleRestart = () => {
    setContainerStatus('building');
    setTimeout(() => setContainerStatus('running'), 2000);
    setConfirmAction(null);
  };

  const handlePause = () => {
    setContainerStatus('ready');
    setConfirmAction(null);
  };

  const handleStop = () => {
    setContainerStatus('ready');
    setConfirmAction(null);
  };

  const handleRemove = () => {
    setContainerStatus('ready');
    setConfirmAction(null);
    // TODO: Actually remove container in future implementation
  };

  const handlePersist = () => {
    // TODO: Save configuration to localStorage or backend
    console.log('Persisting configuration:', config);
    setConfirmAction(null);
  };

  // Determine which actions are available based on status
  const canRestart = containerStatus === 'running' || containerStatus === 'error';
  const canPause = containerStatus === 'running';
  const canStop = containerStatus === 'running' || containerStatus === 'building';
  const canRemove = containerStatus === 'ready' || containerStatus === 'error';
  const canPersist = config !== null;

  return (
    <>
      <div className="flex h-full flex-col p-6">
        {/* Quick actions section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400">Quick Actions</h3>

          <Button
            variant="outline"
            className="w-full justify-start bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
            disabled={!canRestart}
            onClick={() => setConfirmAction('restart')}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Restart Container
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
            disabled={!canPause}
            onClick={() => setConfirmAction('pause')}
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
            disabled={!canStop}
            onClick={() => setConfirmAction('stop')}
          >
            <Square className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </div>

        {/* Destructive actions section */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-zinc-400">Destructive Actions</h3>

          <Button
            variant="outline"
            className="w-full justify-start border-red-900/50 bg-red-900/10 hover:bg-red-900/20 text-red-400"
            disabled={!canRemove}
            onClick={() => setConfirmAction('remove')}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Container
          </Button>
        </div>

        {/* Configuration section */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-zinc-400">Configuration</h3>

          <Button
            variant="outline"
            className="w-full justify-start bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
            disabled={!canPersist}
            onClick={() => setConfirmAction('persist')}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>

          <p className="text-xs text-zinc-500">
            Save current settings for quick container recreation
          </p>
        </div>
      </div>

      {/* Confirmation dialogs */}
      <Dialog open={confirmAction === 'restart'} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Restart Container?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will stop and restart the container. Any unsaved data may be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button onClick={handleRestart}>Restart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAction === 'pause'} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Pause Container?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will pause all processes in the container. The container can be resumed later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button onClick={handlePause}>Pause</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAction === 'stop'} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Stop Container?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will gracefully stop the container. You can restart it later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button onClick={handleStop}>Stop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAction === 'remove'} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 text-red-400">Remove Container?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This action cannot be undone. The container and all its data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAction === 'persist'} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Save Configuration?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will save the current container configuration for quick recreation later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button onClick={handlePersist}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
