# Start Docker for Hot-Reload Test

## Quick Start

```bash
# Option 1: Using helper script (recommended)
./docker-helper.sh start

# Option 2: Using docker-compose directly
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## What You Should See

After starting:
```
✅ Container mui-storybook-dev  Started
✅ Storybook 8.6.14 for react-vite started
✅ Local: http://localhost:6006/
```

Then open your browser to: **http://localhost:6006**

## Hot-Reload Test is Ready

I've already changed the theme file to use RED primary color:
- File: `src/mui-sandbox/theme/theme.ts`
- Change: Primary color → #FF0000 (red)

**When you open Storybook:**
1. Go to the "Button" story
2. All primary buttons should be RED (not blue)
3. This confirms hot-reload picked up the change

## If Buttons Are Still Blue

That means you need to restart the container to pick up the theme change:
```bash
docker-compose restart
# Wait 10 seconds
open http://localhost:6006
```

## Next Test After Confirming Red Buttons

Once you see red buttons, I'll:
1. Change the color to GREEN
2. You watch if it updates automatically (< 2 seconds)
3. That proves hot-reload is working!
