/**
 * Storybook stories for ImageCrate component
 *
 * Demonstrates all animation states and configuration options
 * for the Docker image crate visualization.
 *
 * @see /docs/IMAGE_CRATE_DESIGN_SPEC.md
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ImageCrate } from './ImageCrate';
import type { AnimationState } from './types';

const meta: Meta<typeof ImageCrate> = {
  title: '3D/ImageCrate',
  component: ImageCrate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Docker Image Crate

A 3D visualization of a Docker image as a physical crate that flies into containers.

## Design Specifications
- **Shape:** Rounded rectangular prism (golden ratio: 1.618:1:1)
- **Dimensions:** 1.3 x 0.8 x 0.8 units
- **Material:** Docker blue gradient (#0db7ed)
- **Logo:** Simplified Docker whale on front face

## Animation States
- **idle:** Hidden/off-screen
- **entering:** Flies into container (1.5s arc trajectory with 15° spin)
- **settled:** Rests in container
- **floating:** Subtle hover animation
- **exiting:** Flies out of container (1.0s with 45° rotation)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['idle', 'entering', 'settled', 'floating', 'exiting'],
      description: 'Animation state of the crate',
    },
    scale: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.1 },
      description: 'Scale factor for the crate',
    },
    showLogo: {
      control: 'boolean',
      description: 'Show Docker whale logo on front face',
    },
    color: {
      control: 'color',
      description: 'Base color (Docker blue: #0db7ed)',
    },
    enableGlow: {
      control: 'boolean',
      description: 'Enable subtle glow effect',
    },
    enableFloating: {
      control: 'boolean',
      description: 'Enable idle floating animation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageCrate>;

/**
 * Default idle state (hidden)
 */
export const Idle: Story = {
  args: {
    state: 'idle',
    showLogo: true,
    enableGlow: false,
  },
};

/**
 * Entering animation - Crate flies into container
 */
export const Entering: Story = {
  args: {
    state: 'entering',
    showLogo: true,
    enableGlow: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Arc trajectory with gentle 15° rotation. Duration: 1.5s with bounce at end.',
      },
    },
  },
};

/**
 * Settled state - Crate rests in container
 */
export const Settled: Story = {
  args: {
    state: 'settled',
    showLogo: true,
    enableGlow: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Static position inside the container.',
      },
    },
  },
};

/**
 * Floating animation - Subtle hover effect
 */
export const Floating: Story = {
  args: {
    state: 'floating',
    enableFloating: true,
    showLogo: true,
    enableGlow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle float animation (±0.05 units on Y-axis, 4s cycle) with optional glow.',
      },
    },
  },
};

/**
 * Exiting animation - Crate flies out of container
 */
export const Exiting: Story = {
  args: {
    state: 'exiting',
    showLogo: true,
    enableGlow: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Reverse arc trajectory with 45° rotation. Duration: 1.0s.',
      },
    },
  },
};

/**
 * With glow effect enabled
 */
export const WithGlow: Story = {
  args: {
    state: 'settled',
    showLogo: true,
    enableGlow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Crate with subtle rim glow effect.',
      },
    },
  },
};

/**
 * Without logo
 */
export const WithoutLogo: Story = {
  args: {
    state: 'settled',
    showLogo: false,
    enableGlow: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Plain crate without Docker whale logo.',
      },
    },
  },
};

/**
 * Custom color - Alternative color scheme
 */
export const CustomColor: Story = {
  args: {
    state: 'settled',
    showLogo: true,
    color: '#ff6b6b',
    enableGlow: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Crate with custom color (red in this example).',
      },
    },
  },
};

/**
 * Large scale
 */
export const LargeScale: Story = {
  args: {
    state: 'settled',
    showLogo: true,
    scale: 1.5,
    enableGlow: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Crate scaled to 1.5x size.',
      },
    },
  },
};

/**
 * Interactive demo with state controls
 */
export const Interactive: Story = {
  render: () => {
    const [state, setState] = useState<AnimationState>('settled');
    const [showLogo, setShowLogo] = useState(true);
    const [enableGlow, setEnableGlow] = useState(false);

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Control Panel */}
        <div style={{
          padding: '1rem',
          background: '#263238',
          color: '#fff',
          borderBottom: '1px solid #37474F'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
            Interactive Image Crate Demo
          </h2>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Animation Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>Animation:</span>
              <button
                onClick={() => setState('entering')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: state === 'entering' ? '#0db7ed' : '#37474F',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Enter
              </button>
              <button
                onClick={() => setState('settled')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: state === 'settled' ? '#0db7ed' : '#37474F',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Settle
              </button>
              <button
                onClick={() => setState('floating')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: state === 'floating' ? '#0db7ed' : '#37474F',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Float
              </button>
              <button
                onClick={() => setState('exiting')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: state === 'exiting' ? '#0db7ed' : '#37474F',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Exit
              </button>
            </div>

            {/* Visual Options */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                />
                Show Logo
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={enableGlow}
                  onChange={(e) => setEnableGlow(e.target.checked)}
                />
                Enable Glow
              </label>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#B0BEC5' }}>
            <p style={{ margin: '0.25rem 0' }}>
              💡 <strong>Tip:</strong> Use mouse to rotate, scroll to zoom
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              Current state: <strong>{state}</strong>
            </p>
          </div>
        </div>

        {/* 3D Scene */}
        <div style={{ flex: 1 }}>
          <ImageCrate
            state={state}
            onAnimationComplete={(newState) => {
              console.log('Animation completed:', newState);
              if (newState === 'settled' && state === 'entering') {
                // Auto-transition to floating after entering
                setTimeout(() => setState('floating'), 500);
              }
            }}
            showLogo={showLogo}
            enableGlow={enableGlow}
            enableFloating={state === 'floating'}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Full interactive demo with animation controls and visual options.',
      },
    },
  },
};

/**
 * Animation sequence - Full lifecycle demo
 */
export const AnimationSequence: Story = {
  render: () => {
    const [state, setState] = useState<AnimationState>('idle');
    const [log, setLog] = useState<string[]>([]);

    const addLog = (message: string) => {
      setLog((prev) => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const runSequence = () => {
      setLog([]);
      addLog('Starting sequence...');
      setState('entering');
    };

    const handleAnimationComplete = (newState: AnimationState) => {
      addLog(`Animation completed: ${state} → ${newState}`);
      setState(newState);

      // Auto-progress through sequence
      if (newState === 'settled') {
        setTimeout(() => {
          addLog('Transitioning to floating...');
          setState('floating');
        }, 1000);
      } else if (newState === 'idle' && state === 'exiting') {
        addLog('Sequence complete!');
      }
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        {/* Sidebar */}
        <div style={{
          width: '300px',
          background: '#263238',
          color: '#fff',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Animation Sequence</h2>

          <button
            onClick={runSequence}
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              background: '#0db7ed',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            ▶ Run Sequence
          </button>

          <button
            onClick={() => {
              addLog('Exiting crate...');
              setState('exiting');
            }}
            disabled={state === 'idle'}
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              background: state === 'idle' ? '#37474F' : '#ff6b6b',
              color: '#fff',
              cursor: state === 'idle' ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            ✕ Exit Crate
          </button>

          <div style={{
            flex: 1,
            background: '#1a1a1a',
            padding: '1rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            overflowY: 'auto'
          }}>
            <div style={{ color: '#4CAF50', marginBottom: '0.5rem' }}>Event Log:</div>
            {log.map((entry, i) => (
              <div key={i} style={{ color: '#B0BEC5', marginBottom: '0.25rem' }}>
                {entry}
              </div>
            ))}
          </div>
        </div>

        {/* 3D Scene */}
        <div style={{ flex: 1 }}>
          <ImageCrate
            state={state}
            onAnimationComplete={handleAnimationComplete}
            showLogo={true}
            enableGlow={state === 'floating'}
            enableFloating={state === 'floating'}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete animation sequence with event logging: idle → entering → settled → floating → exiting → idle',
      },
    },
  },
};
