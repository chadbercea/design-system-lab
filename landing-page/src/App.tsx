import './index.css'

const projects = [
  {
    title: 'Docker Desktop Reimagined',
    description: 'A modern, 3D-first reimagining of Docker Desktop\'s UI/UX with glassmorphic design and real-time 3D visualizations.',
    href: '/design-system-lab/docker-image-runner/docker-desktop',
    tags: ['3D', 'Three.js', 'Docker', 'Glassmorphism'],
    status: 'active',
  },
  {
    title: 'Container Demo',
    description: 'Interactive container management demonstration with state transitions and animations.',
    href: '/design-system-lab/docker-image-runner/container-demo',
    tags: ['Docker', 'Animations', 'State Management'],
    status: 'active',
  },
  {
    title: 'Image Crate Demo',
    description: 'Explore 3D image crate system with Docker images rendered as interactive 3D objects.',
    href: '/design-system-lab/docker-image-runner/image-crate-demo',
    tags: ['3D', 'Docker Images', 'Interactive'],
    status: 'active',
  },
  {
    title: 'Panel Demo',
    description: 'Resizable panel system demonstration with smooth interactions and glassmorphic UI.',
    href: '/design-system-lab/docker-image-runner/panel-demo',
    tags: ['UI Components', 'Resizable', 'Layout'],
    status: 'active',
  },
  {
    title: 'Container View',
    description: 'Detailed container inspection and management interface.',
    href: '/design-system-lab/docker-image-runner/container',
    tags: ['Docker', 'Management', 'Details'],
    status: 'active',
  },
  {
    title: 'Settings Demo',
    description: 'Application settings interface with various configuration options.',
    href: '/design-system-lab/docker-image-runner/demo-settings',
    tags: ['Settings', 'Configuration', 'UI'],
    status: 'active',
  },
];

function App() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Design System Lab</h1>
          <p className="text-zinc-400 text-lg">
            A collection of UI/UX experiments and design explorations
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
            <div className="relative z-10">
              <span className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium bg-white text-black mb-4">
                Featured
              </span>
              <h2 className="text-3xl font-bold text-white mb-3">
                Docker Desktop Reimagined
              </h2>
              <p className="text-zinc-300 text-lg mb-6 max-w-2xl">
                Experience Docker container management through an immersive glassmorphic
                interface with real-time 3D visualizations, spatial UI, and state-driven animations.
              </p>
              <div className="flex gap-3 mb-6 flex-wrap">
                {['3D Visualization', 'Three.js', 'React Three Fiber', 'Glassmorphism'].map((tag) => (
                  <span key={tag} className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium border-zinc-700 text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
              <a href="/design-system-lab/docker-image-runner">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-white text-black hover:bg-zinc-200 transition-colors">
                  Launch Demo
                </button>
              </a>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-800/10 pointer-events-none" />
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-6">All Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <a key={project.title} href={project.href}>
                <div className="h-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/80 transition-colors cursor-pointer rounded-xl p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-white text-xl">
                      {project.title}
                    </div>
                    {project.status === 'active' && (
                      <span className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium border-green-700 text-green-500">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium border-zinc-700 text-zinc-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

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
  )
}

export default App
