# Get Started with Docker

**The easiest and most reliable way to run this app.**

## Why Docker?

You mentioned being tired of Claude Code and Conductor breaking your app. Docker solves this by:

1. **Isolation** - The app runs in its own container, completely isolated from your system
2. **Consistency** - Works the same whether you run it locally or deploy to the cloud
3. **Reliability** - No tool can break your app because it's protected inside a container
4. **Reproducibility** - Anyone can run this exact setup on any machine

## One-Time Setup (5 minutes)

### Install Docker Desktop

1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Verify it's running: `docker --version`

That's it! You're ready.

## Running the App (2 commands)

### Development Mode

```bash
# Start the app with hot-reload
./docker-nextjs.sh dev
```

Opens at: **http://localhost:3000**

Changes to your code automatically reload the browser!

### Production Mode

```bash
# Test the production build (same as GitHub Pages)
./docker-nextjs.sh prod
```

Opens at: **http://localhost:8080/design-system-lab**

This is exactly how your app will work when deployed to GitHub Pages.

## Daily Workflow

### Morning: Start working
```bash
./docker-nextjs.sh dev
```

### Coding: Edit files
- Edit any file in `src/`, `app/`, or `public/`
- Browser automatically refreshes
- No need to restart anything

### Testing: Check production build
```bash
# Stop dev server (Ctrl+C)
./docker-nextjs.sh prod
```

### Evening: Clean up
```bash
./docker-nextjs.sh stop
```

## Common Commands

```bash
# View what's happening
./docker-nextjs.sh logs

# Restart after installing new packages
./docker-nextjs.sh rebuild

# Check if containers are healthy
./docker-nextjs.sh health

# Clean everything and start fresh
./docker-nextjs.sh clean

# See all available commands
./docker-nextjs.sh help
```

## Understanding What Docker Does

### Without Docker (Before)
```
Your computer
├── Your Node.js version (might break)
├── Your npm packages (might conflict)
├── Claude Code (might change things)
├── Conductor (might break stuff)
└── Your app (❌ vulnerable to all of the above)
```

### With Docker (Now)
```
Your computer
├── Docker
    └── Container (🔒 isolated)
        ├── Specific Node.js version (locked)
        ├── Exact npm packages (frozen)
        └── Your app (✅ protected from everything)
```

Claude Code and Conductor can't touch what's inside the container!

## First Time Running?

**What to expect:**

1. **First run takes 2-3 minutes**
   - Docker downloads the base images
   - Installs all dependencies
   - Builds the project

2. **Second run takes ~20 seconds**
   - Docker reuses everything from before
   - Only starts the server

3. **After code changes: instant**
   - Hot-reload shows changes in 1-2 seconds
   - No rebuild needed

## Local vs Docker vs Production

| | Local npm | Docker Dev | Docker Prod |
|---|---|---|---|
| **Setup** | npm install | ./docker-nextjs.sh dev | ./docker-nextjs.sh prod |
| **Hot-reload** | ✅ | ✅ | ❌ |
| **Protected** | ❌ | ✅ | ✅ |
| **Matches production** | ⚠️ | ⚠️ | ✅ |
| **Port** | 3000 | 3000 | 8080 |
| **Use when** | Quick testing | Daily development | Pre-deployment testing |

## Deploying to GitHub Pages

Your Docker production build is configured exactly like GitHub Pages:

- **basePath**: `/design-system-lab` ✅
- **Static export**: HTML/JS/CSS files ✅
- **Server**: Nginx (fast and reliable) ✅

To deploy:
```bash
# Build and test locally first
./docker-nextjs.sh prod

# If it works locally, deploy to GitHub Pages
npm run deploy
```

## Troubleshooting

### Docker Desktop not running
```bash
# Start Docker Desktop from Applications
# Wait for it to say "Docker Desktop is running"
```

### Port already in use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it or use a different port
```

### Permission denied
```bash
# Make the script executable
chmod +x docker-nextjs.sh
```

### Changes not showing up
```bash
# Restart the container
./docker-nextjs.sh restart
```

### Something broke completely
```bash
# Nuclear option - clean everything and rebuild
./docker-nextjs.sh clean
./docker-nextjs.sh rebuild
```

## FAQ

**Q: Do I need to install Node.js?**
A: No! Docker provides Node.js inside the container.

**Q: Will this slow down my computer?**
A: Docker uses minimal resources. Allocate 4GB RAM in Docker Desktop settings.

**Q: Can I still use npm install locally?**
A: Yes, but not necessary. If you add packages, run `./docker-nextjs.sh rebuild`

**Q: What if I want to go back to local development?**
A: Just run `npm install && npm run dev` like before. Docker doesn't change your local files.

**Q: How do I add new npm packages?**
A: Add to package.json, then run `./docker-nextjs.sh rebuild`

**Q: Does this work on Windows/Mac/Linux?**
A: Yes! Docker works the same on all platforms.

**Q: Can I use this in CI/CD?**
A: Yes! GitHub Actions can use these Docker files for automated builds.

## Next Steps

1. **Try it now**: Run `./docker-nextjs.sh dev`
2. **Make a change**: Edit a file in `src/`
3. **Watch it reload**: Browser updates automatically
4. **Test production**: Run `./docker-nextjs.sh prod`
5. **Deploy**: When satisfied, run `npm run deploy`

## Learn More

- **Quick Start**: [DOCKER_QUICK_START.md](DOCKER_QUICK_START.md)
- **Full Docs**: [DOCKER.md](DOCKER.md)
- **Summary**: [CONTAINERIZATION_SUMMARY.md](CONTAINERIZATION_SUMMARY.md)

## The Bottom Line

Instead of:
```bash
npm install  # might break
npm run dev  # might break
```

Just do:
```bash
./docker-nextjs.sh dev  # won't break
```

Your app is now protected inside a Docker container. Claude Code, Conductor, and any other tool can't break it anymore.

**That's it! You're containerized. 🐳**
