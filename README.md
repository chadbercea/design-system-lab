# Docker Desktop Reimagined

A modern, 3D-first reimagining of Docker Desktop's UI/UX, built with Next.js, Three.js, and React Three Fiber. Experience Docker container management through an immersive glassmorphic interface with real-time 3D visualizations.

![Docker Desktop Reimagined](https://chadbercea.github.io/design-system-lab/)

## 🎨 Design Philosophy

This project reimagines Docker Desktop's interface with a focus on:

- **3D Visualization**: Interactive 3D container and image crate models with state-driven animations
- **Glassmorphic Design**: Black glass aesthetic with backdrop blur effects and monospace typography
- **Real Docker Assets**: Authentic Docker logos and branding throughout the interface
- **Spatial UI**: Containers exist in 3D space with dynamic camera movements and state transitions
- **Immersive Workflow**: OAuth authentication flows, sequential image loading, and smooth state transitions

### Key Features

- **3D Container Visualization**: Watch containers transition through building → running → error states with wireframe animations
- **Image Crate System**: Docker images rendered as 3D crates that enter and dock inside containers
- **OAuth Flow Simulation**: Full Docker Hub authentication flow with black glass modals
- **Sequential Loading**: Image cards fade in sequentially after authentication
- **State-Driven Animations**: Camera movements, door animations, and visual feedback tied to container lifecycle
- **Glassmorphism UI**: Consistent black glass design with zinc/white color palette
- **Progressive Web App**: Install on any device, works offline, app-like experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/chadbercea/design-system-lab.git
cd design-system-lab/.conductor/surabaya-v1

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the application.

### Install as PWA

The application can be installed on any device as a Progressive Web App:

1. **Desktop (Chrome/Edge)**:
   - Visit the live demo
   - Click the install icon in the address bar
   - Or use Menu → Install Docker Desktop Reimagined

2. **Mobile (iOS/Android)**:
   - Visit the live demo
   - iOS: Tap Share → Add to Home Screen
   - Android: Tap Menu → Install app

3. **Features**:
   - Runs in standalone window (no browser UI)
   - Works offline after first visit
   - App-like experience with native feel
   - Black theme color for status bar

### Build for Production

```bash
# Build static export
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🎯 How It Works

### Authentication Flow

1. **Empty State**: Left sidebar shows "Auth Docker Hub" prompt
2. **OAuth Modal**: Click "Connect" to launch simulated Docker Hub OAuth flow
3. **User Interaction**: Click through "Sign In" and "Authorize" buttons
4. **Success Animation**: Progress bar loads, then image cards fade in sequentially (150ms stagger)

### Container Lifecycle

1. **Ready State**: White wireframe container with closed doors
2. **Building State**:
   - Dotted white wireframe with glow effect
   - Camera rotates around container
   - Image crate enters and docks
   - Walls fade in sequentially
   - Terminal text animates on left door
   - Doors close automatically
3. **Running State**:
   - Black walls with solid white wireframe
   - Container rotates to show right wall
   - Shipping label appears on right wall
   - Docker logo appears on left door
4. **Error State**: Red wireframe, doors open, white walls

### 3D Architecture

- **Three.js**: Core 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components (Html, PerspectiveCamera)
- **Image Crates**: Rounded rectangular prisms with Docker logos
- **Container Doors**: Animated double doors with texture overlays
- **Camera System**: State-driven camera movements and rotations

## 📁 Project Structure

```
src/
├── app/                      # Next.js app directory
├── components/
│   ├── three/               # 3D components
│   │   ├── Container3D.tsx  # Main container component
│   │   ├── ContainerDoors.tsx
│   │   └── ImageCrate/      # Image crate system
│   ├── auth/
│   │   └── DemoOAuthFlow.tsx # OAuth modal flow
│   ├── LeftPanel.tsx        # Image list sidebar
│   └── TopBar.tsx           # Navigation header
├── contexts/
│   └── DemoAuthContext.tsx  # Auth state management
├── lib/
│   ├── container-colors.ts  # Color constants
│   ├── app-state-context.tsx # Global state
│   └── mock-docker-api.ts   # Mock data
└── public/
    └── docker-logo.svg      # Docker logo asset
```

## 🎨 Design System

### Colors

- **Background**: Black (#000000)
- **Glass Surfaces**: `bg-black/80 backdrop-blur-md`
- **Primary Text**: White (#FFFFFF)
- **Secondary Text**: Zinc-400 (#A1A1AA)
- **Borders**: Black with subtle opacity
- **Buttons**: Zinc-600 (gray)
- **Progress Bar**: White
- **Error State**: Red (#FF0000)
- **Success**: Green-500

### Typography

- **Font**: Monospace (Fira Code)
- **Sizes**:
  - Headers: text-2xl (24px)
  - Body: text-base (16px)
  - Small: text-xs (12px)

### Animations

- **Modal Enter**: fade-in + zoom-in-95 (300ms)
- **Step Transitions**: fade-in + slide-in-from-right (500ms)
- **Image Cards**: sequential fade-in with 150ms stagger
- **Container States**: smooth 2-3 second transitions

## 🐳 Next Steps: Containerization

### Build Docker Image

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/out ./out

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npx", "serve", "out", "-p", "3000"]
EOF

# Build the image
docker build -t docker-desktop-reimagined:latest .

# Test locally
docker run -p 3000:3000 docker-desktop-reimagined:latest
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag docker-desktop-reimagined:latest <your-username>/docker-desktop-reimagined:latest

# Push to Docker Hub
docker push <your-username>/docker-desktop-reimagined:latest
```

## 🔧 Development

### Environment Variables

The project uses GitHub Pages deployment with a basePath:

```bash
NEXT_PUBLIC_BASE_PATH=/design-system-lab
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint

## 📦 Dependencies

### Core
- Next.js 16.0.1
- React 19
- Three.js ^0.171.0
- @react-three/fiber ^8.17.10
- @react-three/drei ^9.117.3

### UI/Styling
- Tailwind CSS 3.4.1
- Radix UI components
- Lucide React icons

### Development
- TypeScript 5
- ESLint
- PostCSS

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running fast
- **[Authentication Guide](docs/AUTH_QUICK_START.md)** - Docker Hub OAuth demo setup
- **[Container State System](docs/CONTAINER_STATE_SYSTEM.md)** - State machine documentation
- **[Design System](docs/design-system/README.md)** - Visual style guides and implementation
- **[Storyboard](docs/storyboard/README.md)** - Animation sequences and visual references
- **[Full Documentation Index](docs/README.md)** - Complete documentation catalog

## 🎓 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

This project is a design exploration and reimagining. Docker and Docker logos are trademarks of Docker, Inc.

## 🙏 Acknowledgments

- Docker, Inc. for the Docker platform and branding
- Three.js and React Three Fiber communities
- Next.js team at Vercel
- Radix UI for accessible components

---

**Live Demo**: [https://chadbercea.github.io/design-system-lab/](https://chadbercea.github.io/design-system-lab/)

**Repository**: [https://github.com/chadbercea/design-system-lab](https://github.com/chadbercea/design-system-lab)
