import type { Meta, StoryObj } from '@storybook/react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ContainerDoors } from './ContainerDoors'
import { useState } from 'react'
import * as THREE from 'three'

const meta: Meta<typeof ContainerDoors> = {
  title: 'Three/ContainerDoors',
  component: ContainerDoors,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ContainerDoors>

/**
 * Interactive story that demonstrates the door closing animation
 */
function DoorAnimationDemo() {
  const [doorState, setDoorState] = useState<'open' | 'closing' | 'closed'>('open')

  const handleStartAnimation = () => {
    setDoorState('closing')
  }

  const handleReset = () => {
    setDoorState('open')
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
      <Canvas
        shadows
        camera={{
          position: [0, 5, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, 5, -5]} intensity={0.5} color="#64B5F6" />

        {/* Container walls (for reference) */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6, 5, 8]} />
          <meshStandardMaterial
            color="#263238"
            metalness={0.7}
            roughness={0.4}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Container wireframe */}
        <lineSegments position={[0, 2.5, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(6, 5, 8)]} />
          <lineBasicMaterial color="#90CAF9" linewidth={2} />
        </lineSegments>

        {/* Doors */}
        <ContainerDoors
          state={doorState}
          wireframeMaterial={new THREE.LineBasicMaterial({ color: '#90CAF9', linewidth: 2 })}
          onAnimationComplete={() => {
            setDoorState('closed')
          }}
        />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
        </mesh>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Controls overlay */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(144, 202, 249, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minWidth: '200px',
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
          Door Animation Controls
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleStartAnimation}
            disabled={doorState === 'closing' || doorState === 'closed'}
            style={{
              padding: '8px 16px',
              background: doorState === 'open' ? '#2196F3' : '#424242',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: doorState === 'open' ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            Close Doors
          </button>
          <button
            onClick={handleReset}
            disabled={doorState === 'open'}
            style={{
              padding: '8px 16px',
              background: doorState !== 'open' ? '#455A64' : '#2e2e2e',
              border: '1px solid rgba(144, 202, 249, 0.3)',
              borderRadius: '4px',
              color: 'white',
              cursor: doorState !== 'open' ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            Reset (Open)
          </button>
        </div>
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(144, 202, 249, 0.2)',
            fontSize: '13px',
            color: '#90CAF9',
          }}
        >
          <div style={{ marginBottom: '4px' }}>
            <strong>State:</strong> {doorState}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#b0bec5' }}>
            <strong>Duration:</strong> ~2 seconds
            <br />
            <strong>Easing:</strong> Cubic ease-in-out
            <br />
            <strong>Effect:</strong> Weighted swing with subtle bounce
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Default story showing the door animation demo
 */
export const Default: Story = {
  render: () => <DoorAnimationDemo />,
}

/**
 * Doors in open state (parallel to container front)
 */
export const Open: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}>
      <Canvas
        camera={{
          position: [0, 5, 10],
          fov: 75,
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, 5, -5]} intensity={0.5} color="#64B5F6" />

        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6, 5, 8]} />
          <meshStandardMaterial color="#263238" metalness={0.7} roughness={0.4} transparent opacity={0.3} />
        </mesh>

        <ContainerDoors state="open" wireframeMaterial={new THREE.LineBasicMaterial({ color: '#90CAF9', linewidth: 2 })} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        <OrbitControls />
      </Canvas>
    </div>
  ),
}

/**
 * Doors in closed state (sealing the container)
 */
export const Closed: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}>
      <Canvas
        camera={{
          position: [0, 5, 10],
          fov: 75,
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, 5, -5]} intensity={0.5} color="#64B5F6" />

        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6, 5, 8]} />
          <meshStandardMaterial color="#263238" metalness={0.7} roughness={0.4} transparent opacity={0.3} />
        </mesh>

        <ContainerDoors state="closed" wireframeMaterial={new THREE.LineBasicMaterial({ color: '#90CAF9', linewidth: 2 })} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        <OrbitControls />
      </Canvas>
    </div>
  ),
}
