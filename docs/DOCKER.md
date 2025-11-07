# Docker Setup Guide

This guide explains how to run the Docker Desktop Reimagined app in a Docker container, ensuring consistent behavior between local development and cloud deployment.

## Why Docker?

Running this app in Docker provides:
- **Consistency**: Works the same locally and in production
- **Isolation**: No conflicts with local Node.js versions or dependencies
- **Reproducibility**: Anyone can run the exact same environment
- **Reliability**: Protects against breaking changes from tools like Claude Code or Conductor

## Quick Start

### Prerequisites

- Docker Desktop installed and running
- At least 4GB of RAM allocated to Docker

### Development Mode (with Hot-Reload)

```bash
# Start development server
./docker-nextjs.sh dev

# Or in background
./docker-nextjs.sh dev-bg
```

Access the app at: http://localhost:3000

The development container includes:
- Hot-reload for code changes
- Volume mounts for src/, public/, and config files
- Fast refresh for React components
- Automatic recompilation on file changes

### Production Mode (Static Build)

```bash
# Build and run production version
./docker-nextjs.sh prod

# Or in background
./docker-nextjs.sh prod-bg
```

Access the app at: http://localhost:8080

For the GitHub Pages path: http://localhost:8080/design-system-lab

## Available Commands

The `docker-nextjs.sh` script provides convenient commands:

### Development
- `./docker-nextjs.sh dev` - Start development server
- `./docker-nextjs.sh dev-bg` - Start in background
- `./docker-nextjs.sh logs` - View container logs
- `./docker-nextjs.sh shell` - Open shell in container
- `./docker-nextjs.sh restart` - Restart containers

### Production
- `./docker-nextjs.sh prod` - Build and serve production
- `./docker-nextjs.sh prod-bg` - Production in background
- `./docker-nextjs.sh build-prod` - Build production image only

### Maintenance
- `./docker-nextjs.sh stop` - Stop all containers
- `./docker-nextjs.sh clean` - Remove containers and volumes
- `./docker-nextjs.sh rebuild` - Force rebuild and start
- `./docker-nextjs.sh status` - Show running containers
- `./docker-nextjs.sh health` - Check container health

## Docker Architecture

### Multi-Stage Build

The `Dockerfile.nextjs` uses a multi-stage build for optimization:

1. **base** - Base Node.js image with system dependencies
2. **deps** - Installs npm dependencies (cached)
3. **development** - Development server with hot-reload
4. **builder** - Builds Next.js static export
5. **production** - Nginx serving static files

### What's Included

The Docker setup includes:
- Node.js 20 Alpine (lightweight base image)
- System dependencies for canvas rendering (Three.js)
- Build tools (Python, Make, GCC) for native modules
- Nginx for production serving
- Health checks for container monitoring

### Volume Mounts (Development)

Development mode mounts these directories for hot-reload:
- `./src` - Application source code
- `./public` - Static assets
- `./app` - Next.js app directory
- Config files (next.config.ts, tsconfig.json, etc.)
- `node_modules` - Named volume for performance

Build outputs (`.next`, `out`) are excluded from mounts.

## Direct Docker Commands

If you prefer using Docker directly without the helper script:

### Development

```bash
# Build development image
docker build -f Dockerfile.nextjs --target development -t nextjs-dev .

# Run development container
docker run -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  -v $(pwd)/next.config.ts:/app/next.config.ts \
  -e NODE_ENV=development \
  -e CHOKIDAR_USEPOLLING=true \
  nextjs-dev
```

### Production

```bash
# Build production image
docker build -f Dockerfile.nextjs --target production -t nextjs-prod .

# Run production container
docker run -p 8080:80 nextjs-prod
```

### Using Docker Compose

```bash
# Development
docker-compose -f docker-compose.nextjs.yml up nextjs-dev

# Production
docker-compose -f docker-compose.nextjs.yml --profile production up nextjs-prod

# Stop all
docker-compose -f docker-compose.nextjs.yml down
```

## GitHub Pages Deployment

The production build is configured for GitHub Pages:

- **basePath**: `/design-system-lab`
- **Static Export**: Next.js generates static HTML/JS/CSS
- **Nginx Config**: Routes handle the basePath correctly
- **Local Testing**: http://localhost:8080/design-system-lab

This means the Docker production build matches exactly what gets deployed to GitHub Pages.

## Troubleshooting

### Container won't start

```bash
# Check if Docker is running
docker info

# View container logs
./docker-nextjs.sh logs

# Check container status
./docker-nextjs.sh status
```

### Port already in use

```bash
# Find what's using port 3000
lsof -i :3000

# Or use different port
docker run -p 3001:3000 nextjs-dev
```

### Hot-reload not working

The Docker setup includes:
- `CHOKIDAR_USEPOLLING=true` - Enables file watching in Docker
- `WATCHPACK_POLLING=true` - Next.js polling for file changes

If still not working:
1. Ensure Docker has file sharing enabled for your project directory
2. Restart the container: `./docker-nextjs.sh restart`
3. Rebuild: `./docker-nextjs.sh rebuild`

### Build fails with "out of memory"

Increase Docker's memory allocation:
1. Open Docker Desktop
2. Settings → Resources → Memory
3. Allocate at least 4GB
4. Apply & Restart

### Clean slate

```bash
# Stop and remove everything
./docker-nextjs.sh clean

# Remove all Docker images
docker rmi $(docker images 'nextjs-*' -q)

# Start fresh
./docker-nextjs.sh rebuild
```

## Performance Tips

1. **Use named volumes for node_modules** - Already configured in docker-compose
2. **Don't mount node_modules** - Excluded from volume mounts
3. **Use BuildKit** - Docker BuildKit is enabled by default
4. **Layer caching** - Package files copied before source code

## Comparison with Local Development

| Feature | Local Dev | Docker Dev | Docker Prod |
|---------|-----------|------------|-------------|
| Hot-reload | ✅ | ✅ | ❌ |
| Port | 3000 | 3000 | 8080 |
| Build time | Fast | Medium | Slow |
| Isolation | ❌ | ✅ | ✅ |
| Consistency | ⚠️ | ✅ | ✅ |
| Production-ready | ❌ | ❌ | ✅ |

## Security Notes

The production image:
- Runs Nginx as non-root
- Includes security headers
- Only exposes port 80
- No unnecessary packages
- Health check monitoring

## Next Steps

- **Deploy to Cloud**: Use the production image for cloud deployment
- **CI/CD**: Integrate Docker build into GitHub Actions
- **Monitoring**: Add logging and monitoring solutions
- **Scaling**: Use Docker Swarm or Kubernetes for scaling

## Files Overview

- `Dockerfile.nextjs` - Multi-stage Dockerfile for Next.js
- `docker-compose.nextjs.yml` - Docker Compose configuration
- `docker-nextjs.sh` - Helper script for common operations
- `.dockerignore` - Files excluded from Docker builds
- `DOCKER.md` - This documentation file

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs: `./docker-nextjs.sh logs`
3. Check container health: `./docker-nextjs.sh health`
4. Open an issue with logs and Docker version

## Learn More

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Docker Compose](https://docs.docker.com/compose/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
