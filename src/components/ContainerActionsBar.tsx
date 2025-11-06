'use client'

import { useAppState } from '@/lib/app-state-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RotateCcw, Pause, Square, Trash2, Save } from 'lucide-react'
import { useState } from 'react'

interface ContainerActionsBarProps {
  isTerminalOpen: boolean
}

export function ContainerActionsBar({ isTerminalOpen }: ContainerActionsBarProps) {
  const { containerStatus, config, setContainerStatus, setSelectedImage } = useAppState()

  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [showPersistDialog, setShowPersistDialog] = useState(false)

  // Button availability logic
  const canRestart = containerStatus === 'running' || containerStatus === 'error'
  const canPause = containerStatus === 'running'
  const canStop = containerStatus === 'running' || containerStatus === 'building'
  const canRemove = containerStatus === 'running' // Only allow delete when container is running
  const canPersist = config !== null

  // Action handlers (mock implementations)
  const handleRestart = () => {
    console.log('Restarting container...')
    setContainerStatus('building')
    setTimeout(() => {
      setContainerStatus('running')
    }, 2000)
  }

  const handlePause = () => {
    console.log('Pausing container...')
    setContainerStatus('ready')
  }

  const handleStop = () => {
    console.log('Stopping container...')
    setContainerStatus('ready')
  }

  const handleRemove = () => {
    console.log('Removing container...')
    setContainerStatus('ready')
    setSelectedImage(null)
    setShowRemoveDialog(false)
  }

  const handlePersist = () => {
    console.log('Persisting configuration:', config)
    // TODO: Implement actual persistence logic (localStorage or backend)
    setShowPersistDialog(false)
  }

  // Calculate bottom position: 20px above terminal bar
  // Terminal trigger is 30px, terminal is 300px when open
  const bottomPosition = isTerminalOpen ? 320 : 50 // 300px (terminal) + 20px or 30px (trigger) + 20px

  return (
    <>
      <div
        className="fixed left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-black/95 backdrop-blur-sm border border-zinc-700 rounded-lg px-3 py-2 shadow-lg transition-all duration-300"
        style={{ bottom: `${bottomPosition}px` }}
      >
        <Button
          variant="ghost"
          size="sm"
          disabled={!canRestart}
          onClick={handleRestart}
          className="h-8 px-3 text-zinc-300 hover:text-white"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!canPause}
          onClick={handlePause}
          className="h-8 px-3 text-zinc-300 hover:text-white"
        >
          <Pause className="h-4 w-4 mr-2" />
          Pause
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!canStop}
          onClick={handleStop}
          className="h-8 px-3 text-zinc-300 hover:text-white"
        >
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>

        <div className="h-4 w-px bg-zinc-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          disabled={!canRemove}
          onClick={() => setShowRemoveDialog(true)}
          className="h-8 px-3 text-zinc-300 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>

        <div className="h-4 w-px bg-zinc-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          disabled={!canPersist}
          onClick={() => setShowPersistDialog(true)}
          className="h-8 px-3 text-zinc-300 hover:text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Remove Container Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle>Remove Container</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this container? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Config Confirmation Dialog */}
      <Dialog open={showPersistDialog} onOpenChange={setShowPersistDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle>Save Configuration</DialogTitle>
            <DialogDescription>
              Save the current container configuration for future use?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPersistDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePersist}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
