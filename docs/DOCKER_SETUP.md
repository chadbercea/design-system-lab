# Docker Setup for MUI Sandbox

This guide explains how to run the MUI Sandbox with Storybook in Docker for consistent development environments.

## Prerequisites

1. **Docker Desktop** must be installed and running
   - Download from: https://www.docker.com/products/docker-desktop/
   - After installation, ensure Docker Desktop is running (check menu bar icon)
   - Verify with: `docker --version`

## Quick Start

### Development Environment

```bash
# Start the development environment with hot-reload
docker-compose up

# Or run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f mui-storybook

# Stop the container
docker-compose down
```

Once running, access Storybook at: **http://localhost:6006**

### Production Build (Optional)

To test the production build locally:

```bash
# Build and run production Storybook
docker-compose --profile production up mui-storybook-prod
```

Access production build at: **http://localhost:8080**

## What's Included

### Dockerfile

Multi-stage Dockerfile with optimizations:

- **Base Stage**: Node 20 Alpine for minimal image size
- **Dependencies Stage**: Efficient npm install with layer caching
- **Development Stage**: Hot-reload enabled with volume mounting
- **Builder Stage**: Production Storybook build
- **Production Stage**: Nginx serving static Storybook files

### docker-compose.yml

Development-optimized configuration:

- Port mapping: `6006:6006` (Storybook)
- Volume mounting for hot-reload:
  - `./src/mui-sandbox` - Theme and component files
  - `./.storybook` - Storybook configuration
- Named volume for `node_modules` (performance)
- Environment variables for optimal hot-reload
- Production profile for testing builds

### .dockerignore

Excludes unnecessary files from build context:
- `node_modules` (reinstalled in container)
- Build outputs (`.next`, `out`, `storybook-static`)
- Environment files, logs, IDE configs
- Documentation and scripts not needed in container

## Hot-Reload in Docker

Hot-reload is fully supported! Changes to these files automatically refresh Storybook:

- `src/mui-sandbox/theme/theme.ts` - Theme customizations
- `src/mui-sandbox/components/*.tsx` - Component files
- `src/mui-sandbox/components/*.stories.tsx` - Storybook stories
- `.storybook/main.ts` - Storybook configuration
- `.storybook/preview.tsx` - Storybook preview config

**Expected hot-reload latency**: < 2 seconds

## Performance Benchmarks

### Target Metrics (from requirements)

- ✅ Initial image build: < 3 minutes
- ✅ Container startup: < 30 seconds
- ✅ Hot-reload latency: < 2 seconds
- ✅ Rebuild after code changes: < 30 seconds

### Optimizations Implemented

1. **Multi-stage builds** - Separate dev and prod stages
2. **Layer caching** - Package files copied before source
3. **Named volume for node_modules** - Faster I/O on macOS/Windows
4. **Alpine base image** - ~40MB vs ~300MB for standard Node
5. **Polling optimization** - `CHOKIDAR_INTERVAL=100` for fast hot-reload

## Common Commands

```bash
# Build without starting
docker-compose build

# Rebuild and start (force rebuild)
docker-compose up --build

# View running containers
docker ps

# Stop all services
docker-compose down

# Remove volumes (clean state)
docker-compose down -v

# View container logs
docker-compose logs -f

# Execute commands in running container
docker-compose exec mui-storybook npm run build

# Shell access to container
docker-compose exec mui-storybook sh
```

## Troubleshooting

### Docker daemon not running

**Error**: `Cannot connect to the Docker daemon`

**Solution**: Start Docker Desktop from Applications folder or menu bar

### Port 6006 already in use

**Error**: `Bind for 0.0.0.0:6006 failed: port is already allocated`

**Solution**: Stop local Storybook instance or change port in `docker-compose.yml`

```bash
# Find process using port 6006
lsof -i :6006

# Kill the process
kill -9 <PID>
```

### Hot-reload not working

**Issue**: Changes not reflecting in Storybook

**Solutions**:

1. **Check volume mounts**: Ensure paths in `docker-compose.yml` match your structure
2. **Enable polling**: Already configured with `CHOKIDAR_USEPOLLING=true`
3. **Check file permissions**: On Linux, may need to adjust user permissions
4. **Restart container**: `docker-compose restart mui-storybook`

### Slow startup on macOS/Windows

**Issue**: Node modules installation is slow

**Explanation**: This is expected on first run (installing all dependencies)

**Optimization**: Named volume for `node_modules` improves performance on subsequent runs

### Build context too large

**Error**: Sending build context taking long time

**Solution**: Review `.dockerignore` and ensure large directories are excluded

## Architecture Notes

### Why Multi-stage Build?

- **Development**: Full Node environment with hot-reload
- **Production**: Minimal nginx serving static files (50MB vs 500MB+)
- **Separation of concerns**: Dev dependencies don't bloat production image

### Why Named Volume for node_modules?

On macOS and Windows, Docker uses a VM. Bind mounting `node_modules` causes poor I/O performance. Named volumes are stored in the Linux VM, providing native filesystem performance.

### Why CHOKIDAR_USEPOLLING?

Docker volume mounts on macOS/Windows don't always propagate file system events reliably. Polling ensures hot-reload works consistently across all host operating systems.

## Comparing Local vs Docker

### Local Development

**Pros:**
- Faster initial startup (no Docker build)
- Direct filesystem access
- Easier debugging

**Cons:**
- Environment inconsistencies across machines
- Node version differences
- Dependency conflicts

### Docker Development

**Pros:**
- Consistent environment for all developers
- Isolated dependencies
- Production-like testing
- Easy cleanup (`docker-compose down -v`)

**Cons:**
- Initial build time (~2-3 minutes)
- Slightly slower file I/O (mitigated with optimizations)
- Requires Docker Desktop running

## When to Use Docker

✅ **Use Docker when:**
- Setting up on a new machine
- Debugging environment-specific issues
- Testing production builds locally
- Collaborating with team (ensures consistency)
- Learning Docker patterns

🔧 **Use local when:**
- Quick theme tweaks
- Rapid prototyping
- Debugging with IDE integrations
- Docker Desktop not available

## Next Steps

After getting Docker working:

1. ✅ Verify hot-reload works for theme changes
2. ✅ Verify hot-reload works for component changes
3. ✅ Test production build with `--profile production`
4. 📚 Document any environment-specific issues
5. 🚀 Consider CI/CD integration (future)

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Storybook Docker Guide](https://storybook.js.org/docs/react/workflows/publish-storybook#run-storybook-in-docker)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

**Happy containerizing!** 🐳
