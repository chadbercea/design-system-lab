# Docker Quick Start

Get the app running in Docker in under 2 minutes.

## Prerequisites

- Docker Desktop installed and running
- Git (to clone the repository)

## Step 1: Clone the Repository

```bash
git clone https://github.com/chadbercea/design-system-lab.git
cd design-system-lab/.conductor/seville
```

## Step 2: Start the App

### Development Mode (with hot-reload)

```bash
./docker-nextjs.sh dev
```

**First run takes ~2-3 minutes** to download images and install dependencies. Subsequent runs are much faster due to Docker layer caching.

Access the app at: **http://localhost:3000**

### Production Mode (test deployment)

```bash
./docker-nextjs.sh prod
```

Access the app at: **http://localhost:8080**

For GitHub Pages path: **http://localhost:8080/design-system-lab**

## Step 3: Make Changes

In development mode, edit any file in `src/` and watch it automatically reload in the browser!

## Common Commands

```bash
# View logs
./docker-nextjs.sh logs

# Stop containers
./docker-nextjs.sh stop

# Restart
./docker-nextjs.sh restart

# Clean everything
./docker-nextjs.sh clean

# See all commands
./docker-nextjs.sh help
```

## Troubleshooting

### "Permission denied" when running docker-nextjs.sh

```bash
chmod +x docker-nextjs.sh
```

### "Cannot connect to Docker daemon"

Make sure Docker Desktop is running.

### Port 3000 or 8080 already in use

```bash
# Find and stop the process using the port
lsof -i :3000
# Or change the port in docker-compose.nextjs.yml
```

### Hot-reload not working

Docker file watching is already enabled. If it's still not working:

```bash
./docker-nextjs.sh restart
```

## What's Next?

- Read the full [DOCKER.md](DOCKER.md) documentation
- Explore the [main README](README.md) for app features
- Check the [docs/](docs/) directory for comprehensive guides

## Why Docker?

Running in Docker means:
- ✅ Works the same on every machine
- ✅ No conflicts with your local Node.js setup
- ✅ Same environment as production
- ✅ Protected from breaking changes by external tools
- ✅ Easy to share with team members

## File Structure

```
.
├── Dockerfile.nextjs           # Docker image configuration
├── docker-compose.nextjs.yml   # Container orchestration
├── docker-nextjs.sh            # Helper script (use this!)
├── DOCKER.md                   # Full documentation
└── DOCKER_QUICK_START.md       # This file
```

## Still Have Questions?

Check the full [DOCKER.md](DOCKER.md) documentation for:
- Detailed architecture explanation
- Advanced usage
- Performance optimization
- CI/CD integration
- Cloud deployment guides
