# Documentation

Comprehensive documentation for the Docker Desktop Reimagined project.

## Quick Links

- **[Quick Start Guide](QUICK_START.md)** - Get up and running fast
- **[Authentication Guide](AUTH_QUICK_START.md)** - Set up Docker Hub OAuth demo
- **[Container State System](CONTAINER_STATE_SYSTEM.md)** - Understanding container states

## Documentation Structure

### 📦 Core Documentation

- **[AUTHENTICATION.md](AUTHENTICATION.md)** - Complete authentication implementation details
- **[AUTH_QUICK_START.md](AUTH_QUICK_START.md)** - Quick start guide for auth demo
- **[CONTAINER_STATE_SYSTEM.md](CONTAINER_STATE_SYSTEM.md)** - Container state machine documentation
- **[QUICK_START.md](QUICK_START.md)** - General project quick start
- **[docker-hub-auth-implementation.md](docker-hub-auth-implementation.md)** - Docker Hub auth deep dive

### 🎨 Design System

Located in `design-system/`:
- **[README.md](design-system/README.md)** - Design system overview
- **[CONTAINER_IMPLEMENTATION_GUIDE.md](design-system/CONTAINER_IMPLEMENTATION_GUIDE.md)** - 3D container implementation
- **[CONTAINER_VISUAL_STYLE_GUIDE.md](design-system/CONTAINER_VISUAL_STYLE_GUIDE.md)** - Visual styling guidelines
- **[QUICK_REFERENCE.md](design-system/QUICK_REFERENCE.md)** - Quick reference guide

### 📦 Image Crate System

- **[IMAGE_CRATE_DESIGN_SPEC.md](IMAGE_CRATE_DESIGN_SPEC.md)** - Design specifications
- **[IMAGE_CRATE_VISUAL_REFERENCE.md](IMAGE_CRATE_VISUAL_REFERENCE.md)** - Visual reference guide

### 🎬 Storyboard

Located in `storyboard/`:
- **[README.md](storyboard/README.md)** - Storyboard system overview
- **[30_SECOND_SEQUENCE_STORYBOARD.md](storyboard/30_SECOND_SEQUENCE_STORYBOARD.md)** - Animation sequence
- **[IMPLEMENTATION_GUIDE.md](storyboard/IMPLEMENTATION_GUIDE.md)** - Implementation details
- **[VISUAL_REFERENCE_GUIDE.md](storyboard/VISUAL_REFERENCE_GUIDE.md)** - Visual references

### ⚙️ Setup & Configuration

Located in `setup/`:
- **MCP Server Setups**:
  - [FIGMA_MCP_SETUP.md](setup/FIGMA_MCP_SETUP.md)
  - [NOTION_MCP_SETUP.md](setup/NOTION_MCP_SETUP.md)
  - [SENTRY_MCP_SETUP.md](setup/SENTRY_MCP_SETUP.md)
  - [MCP_CONFIG_GUIDE.md](setup/MCP_CONFIG_GUIDE.md)
- **Troubleshooting**:
  - [FIGMA_MCP_TROUBLESHOOTING_REPORT.md](setup/FIGMA_MCP_TROUBLESHOOTING_REPORT.md)
  - [FIX_FIGMA_MCP_TUTORIAL.md](setup/FIX_FIGMA_MCP_TUTORIAL.md)

### 🔧 Implementation Docs

Located in `implementation/`:
- **[DOCKER_IMPLEMENTATION_SUMMARY.md](implementation/DOCKER_IMPLEMENTATION_SUMMARY.md)** - Docker integration summary
- **[IMAGE_CRATE_IMPLEMENTATION_GUIDE.md](implementation/IMAGE_CRATE_IMPLEMENTATION_GUIDE.md)** - Image crate implementation
- **[SHADCN_REFACTOR.md](SHADCN_REFACTOR.md)** - UI component refactor details

### 🧪 Testing & Validation

Located in `testing/`:
- **[DOCKER_VALIDATION.md](testing/DOCKER_VALIDATION.md)** - Docker setup validation
- **[START_DOCKER_TEST.md](testing/START_DOCKER_TEST.md)** - Testing instructions

### 📋 Linear Issues

Located in `linear-issues/`:
- ILI-89, ILI-95, ILI-97 - Implementation summaries and checklists
- Historical issue tracking and completion records

### 📚 Examples

Located in `examples/`:
- **[notion-mcp-workflows.md](examples/notion-mcp-workflows.md)** - Notion MCP usage examples
- **[sentry-mcp-workflows.md](examples/sentry-mcp-workflows.md)** - Sentry MCP usage examples

### 🎨 MUI Sandbox

Located in `mui-sandbox/`:
- Material-UI exploration and assessments
- Theme customization documentation
- Delta analysis between stock MUI and custom design

### 🗄️ Archived

Located in `archived/`:
- Historical documentation
- Completed phase reports
- Legacy implementation plans

## Technology Stack

- **Framework**: Next.js 16 with Turbopack
- **3D Graphics**: Three.js with React Three Fiber
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Authentication**: OAuth 2.0 Demo Flow
- **Deployment**: GitHub Pages

## Key Features

1. **3D Container Visualization** - Interactive Three.js container with realistic animations
2. **OAuth Demo Flow** - Simulated Docker Hub authentication
3. **Progressive Web App** - Installable with offline support
4. **Real-time Stats** - Live CPU/Memory monitoring
5. **Container State Machine** - Building → Running states with animations
6. **Glassmorphic Design** - Modern, translucent UI elements

## Getting Started

1. Review the **[Quick Start Guide](QUICK_START.md)**
2. Set up authentication with **[Auth Quick Start](AUTH_QUICK_START.md)**
3. Explore the **[Design System](design-system/README.md)**
4. Check out **[Examples](examples/)** for common workflows

## Contributing

When adding new documentation:
1. Place in the appropriate subdirectory
2. Update this README with a link
3. Follow existing naming conventions (UPPERCASE_WITH_UNDERSCORES.md)
4. Include code examples where applicable

## Live Demo

**URL**: [https://chadbercea.github.io/design-system-lab/](https://chadbercea.github.io/design-system-lab/)

## Repository

**GitHub**: [https://github.com/chadbercea/design-system-lab](https://github.com/chadbercea/design-system-lab)
