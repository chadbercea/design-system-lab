'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    title: 'Docker Desktop Reimagined',
    description: 'A modern, 3D-first reimagining of Docker Desktop\'s UI/UX with glassmorphic design and real-time 3D visualizations.',
    href: '/docker-desktop',
    tags: ['3D', 'Three.js', 'Docker', 'Glassmorphism'],
    status: 'active',
  },
  {
    title: 'Container Demo',
    description: 'Interactive container management demonstration with state transitions and animations.',
    href: '/container-demo',
    tags: ['Docker', 'Animations', 'State Management'],
    status: 'active',
  },
  {
    title: 'Image Crate Demo',
    description: 'Explore 3D image crate system with Docker images rendered as interactive 3D objects.',
    href: '/image-crate-demo',
    tags: ['3D', 'Docker Images', 'Interactive'],
    status: 'active',
  },
  {
    title: 'Panel Demo',
    description: 'Resizable panel system demonstration with smooth interactions and glassmorphic UI.',
    href: '/panel-demo',
    tags: ['UI Components', 'Resizable', 'Layout'],
    status: 'active',
  },
  {
    title: 'Container View',
    description: 'Detailed container inspection and management interface.',
    href: '/container',
    tags: ['Docker', 'Management', 'Details'],
    status: 'active',
  },
  {
    title: 'Settings Demo',
    description: 'Application settings interface with various configuration options.',
    href: '/demo-settings',
    tags: ['Settings', 'Configuration', 'UI'],
    status: 'active',
  },
  {
    title: 'Simple Settings',
    description: 'Simplified settings interface demonstration.',
    href: '/demo-settings-simple',
    tags: ['Settings', 'UI', 'Minimal'],
    status: 'active',
  },
  {
    title: 'Settings',
    description: 'Main settings configuration page.',
    href: '/settings',
    tags: ['Settings', 'Configuration'],
    status: 'active',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Design System Lab</h1>
          <p className="text-zinc-400 text-lg">
            A collection of UI/UX experiments and design explorations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Featured Project */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
            <div className="relative z-10">
              <Badge className="mb-4 bg-white text-black hover:bg-zinc-200">
                Featured
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-3">
                Docker Desktop Reimagined
              </h2>
              <p className="text-zinc-300 text-lg mb-6 max-w-2xl">
                Experience Docker container management through an immersive glassmorphic
                interface with real-time 3D visualizations, spatial UI, and state-driven animations.
              </p>
              <div className="flex gap-3 mb-6">
                {['3D Visualization', 'Three.js', 'React Three Fiber', 'Glassmorphism'].map((tag) => (
                  <Badge key={tag} variant="outline" className="border-zinc-700 text-zinc-400">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link href="/docker-desktop">
                <Button className="bg-white text-black hover:bg-zinc-200">
                  Launch Demo
                </Button>
              </Link>
            </div>
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-800/10 pointer-events-none" />
          </div>
        </section>

        {/* All Projects Grid */}
        <section>
          <h3 className="text-2xl font-bold text-white mb-6">All Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.href} href={project.href}>
                <Card className="h-full border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/80 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-white text-xl">
                        {project.title}
                      </CardTitle>
                      {project.status === 'active' && (
                        <Badge variant="outline" className="border-green-700 text-green-500 text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-zinc-400">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-zinc-700 text-zinc-500 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">
              Design System Lab - UI/UX Experiments & Explorations
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/chadbercea/design-system-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="https://chadbercea.github.io/design-system-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
              >
                Live Demo
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
