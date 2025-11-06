'use client'

import { useAppState } from '@/lib/app-state-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { RotateCcw, Pause, Square, MoreVertical, Trash2, Save } from 'lucide-react'
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
          className="h-8 px-3"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!canPause}
          onClick={handlePause}
          className="h-8 px-3"
        >
          <Pause className="h-4 w-4 mr-2" />
          Pause
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!canStop}
          onClick={handleStop}
          className="h-8 px-3"
        >
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={!canRemove}
              onClick={() => setShowRemoveDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Container
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!canPersist}
              onClick={() => setShowPersistDialog(true)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Config
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Remove Container Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Container</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this container? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save Config Confirmation Dialog */}
      <AlertDialog open={showPersistDialog} onOpenChange={setShowPersistDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Save the current container configuration for future use?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePersist}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
