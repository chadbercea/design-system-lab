'use client';

import React, { useState } from 'react';
import { ContainerScene } from '@/components/three/ContainerScene';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Container Visualization Demo Page
 *
 * Displays a 3D shipping container with materialization animation.
 * This demonstrates the "seal & run" phase where walls fade from transparent to opaque.
 *
 * Features:
 * - Container with shipping container proportions (1:1:2.5 ratio)
 * - Visible wireframe edges using EdgesGeometry
 * - Interactive camera controls (orbit, zoom, pan)
 * - Wall materialization animation (opacity 0 → 1)
 * - Docker logo texture on front panel
 * - 30° elevation viewing angle
 * - Three-light setup (ambient, directional, rim)
 *
 * @see ILI-98: [Developer] Walls materialize (opacity transition)
 */
export default function ContainerDemo() {
  const [animationKey, setAnimationKey] = useState(0);
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50">
            Container Visualization
          </h1>
          <p className="mt-2 text-lg text-zinc-400">
            Static 3D shipping container with procedural geometry
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
          {/* Main 3D Scene */}
          <Card className="overflow-hidden border-zinc-800 bg-zinc-900">
            <CardContent className="p-0">
              <ContainerScene
                key={animationKey}
                height="600px"
                showControls={true}
              />
            </CardContent>
          </Card>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-zinc-50">Technical Details</CardTitle>
                <CardDescription className="text-zinc-400">
                  Container specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-300">
                <div>
                  <div className="font-semibold text-zinc-50">Dimensions</div>
                  <div>2.4m × 2.4m × 6.0m</div>
                  <div className="text-xs text-zinc-500">
                    Standard shipping container proportions (1:1:2.5)
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-zinc-50">Geometry</div>
                  <div>BoxGeometry for walls</div>
                  <div>EdgesGeometry for wireframe</div>
                </div>

                <div>
                  <div className="font-semibold text-zinc-50">Materials</div>
                  <div>MeshStandardMaterial (walls)</div>
                  <div className="text-xs text-zinc-500">
                    Metalness: 0.7, Roughness: 0.4
                  </div>
                  <div className="mt-1">LineBasicMaterial (edges)</div>
                </div>

                <div>
                  <div className="font-semibold text-zinc-50">Lighting</div>
                  <div>Ambient (40% intensity)</div>
                  <div>Directional key light (100%)</div>
                  <div>Rim light (50%)</div>
                  <div>Accent point light (80%)</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-zinc-50">Animation Controls</CardTitle>
                <CardDescription className="text-zinc-400">
                  Test wall materialization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setAnimationKey((prev) => prev + 1);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Reset Camera
                  </Button>
                </div>
                <div className="space-y-1 text-sm text-zinc-400">
                  <div className="font-semibold text-zinc-300">Status:</div>
                  <div>Ready</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-zinc-50">Camera Controls</CardTitle>
                <CardDescription className="text-zinc-400">
                  Interact with the scene
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Rotate</span>
                  <span>Left Click + Drag</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Zoom</span>
                  <span>Scroll Wheel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Pan</span>
                  <span>Right Click + Drag</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-zinc-50">Next Steps</CardTitle>
                <CardDescription className="text-zinc-400">
                  Future enhancements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-300">
                <div>• Add dotted wireframe for ghost lines</div>
                <div>• Implement state-based animations</div>
                <div>• Add build animation sequence</div>
                <div>• Integrate image crate visualization</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
