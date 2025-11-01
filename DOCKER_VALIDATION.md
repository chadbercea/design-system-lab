# Docker Validation Checklist

Use this checklist to validate the MUI Sandbox Docker setup once Docker Desktop is running.

## Prerequisites

- [ ] Docker Desktop installed
- [ ] Docker Desktop running (check menu bar)
- [ ] Port 6006 available (no local Storybook running)

## Build and Startup Tests

### 1. Initial Build

```bash
docker-compose build
```

**Expected results:**
- [ ] Build completes without errors
- [ ] Build time < 3 minutes (target from requirements)
- [ ] Final image size reasonable (check with `docker images`)

### 2. Container Startup

```bash
./docker-helper.sh start-bg
```

**Expected results:**
- [ ] Container starts successfully
- [ ] Startup time < 30 seconds after initial build (target from requirements)
- [ ] No errors in logs: `./docker-helper.sh logs`
- [ ] Storybook accessible at http://localhost:6006

### 3. Storybook Functionality

Visit http://localhost:6006

**Expected results:**
- [ ] Storybook loads successfully
- [ ] MUI Sandbox section visible in sidebar
- [ ] All stories render:
  - [ ] Button story
  - [ ] Card story
  - [ ] TextField story
  - [ ] Typography story
- [ ] Components display correctly
- [ ] No console errors

## Hot-Reload Tests

### 4. Theme Hot-Reload

Edit `src/mui-sandbox/theme/theme.ts` and change the primary color:

```typescript
palette: {
  primary: {
    main: '#FF0000', // Change to red
  },
}
```

**Expected results:**
- [ ] Storybook auto-reloads
- [ ] Hot-reload latency < 2 seconds (target from requirements)
- [ ] Primary buttons now show red color
- [ ] No page refresh required
- [ ] No errors in browser console

Revert the change and verify it hot-reloads back.

### 5. Component Hot-Reload

Edit `src/mui-sandbox/components/Button.stories.tsx` and change a button label:

```typescript
<Button variant="contained">Test Hot Reload</Button>
```

**Expected results:**
- [ ] Storybook auto-reloads
- [ ] Hot-reload latency < 2 seconds
- [ ] Button label updates
- [ ] No page refresh required

### 6. Story Hot-Reload

Create a new story in `Button.stories.tsx`:

```typescript
export const TestStory = () => (
  <Button variant="outlined" color="secondary">
    Docker Test
  </Button>
);
```

**Expected results:**
- [ ] New story appears in Storybook sidebar
- [ ] Story renders correctly
- [ ] Hot-reload works

## Volume Mount Verification

### 7. Verify Volume Mounts

```bash
docker-compose exec mui-storybook ls -la /app/src/mui-sandbox
```

**Expected results:**
- [ ] Source files visible in container
- [ ] File timestamps match host system
- [ ] Node modules mounted as volume

### 8. File Permissions

```bash
docker-compose exec mui-storybook touch /app/src/mui-sandbox/test.txt
```

Then check on host: `ls src/mui-sandbox/test.txt`

**Expected results:**
- [ ] File created in container appears on host
- [ ] File writable from both host and container
- [ ] Clean up: `rm src/mui-sandbox/test.txt`

## Performance Tests

### 9. Rebuild Time

Make a small change to `theme.ts`, then:

```bash
docker-compose restart
```

**Expected results:**
- [ ] Restart completes in < 30 seconds (target from requirements)
- [ ] Changes persist after restart

### 10. Clean Rebuild

```bash
./docker-helper.sh clean
./docker-helper.sh start
```

**Expected results:**
- [ ] Clean rebuild works
- [ ] Build time still < 3 minutes
- [ ] No leftover state issues

## Production Build Test

### 11. Production Build

```bash
docker-compose --profile production build mui-storybook-prod
docker-compose --profile production up mui-storybook-prod
```

**Expected results:**
- [ ] Production build completes
- [ ] Static files generated
- [ ] Nginx serves Storybook at http://localhost:8080
- [ ] All stories accessible
- [ ] Production build is optimized (smaller size)

Check production image size:
```bash
docker images | grep mui-storybook
```

## Helper Script Tests

### 12. Test Helper Commands

```bash
# Test each command
./docker-helper.sh status
./docker-helper.sh stop
./docker-helper.sh start-bg
./docker-helper.sh logs  # Ctrl+C to exit
./docker-helper.sh restart
./docker-helper.sh help
```

**Expected results:**
- [ ] All commands work without errors
- [ ] Status shows running containers
- [ ] Logs display properly
- [ ] Help shows usage information

## Cleanup Tests

### 13. Full Cleanup

```bash
./docker-helper.sh clean
```

**Expected results:**
- [ ] Containers stopped and removed
- [ ] Volumes removed
- [ ] Network removed
- [ ] Can rebuild fresh without issues

## Edge Cases

### 14. Port Conflict

Start local Storybook (`npm run storybook`), then try Docker:

```bash
docker-compose up
```

**Expected results:**
- [ ] Gets error about port 6006 in use
- [ ] Error message is clear
- [ ] Can resolve by stopping local Storybook

### 15. Docker Daemon Not Running

Stop Docker Desktop, then:

```bash
./docker-helper.sh start
```

**Expected results:**
- [ ] Helper script detects Docker not running
- [ ] Provides clear error message
- [ ] Suggests starting Docker Desktop

## Success Metrics Summary

From Linear issue ILI-82 requirements:

- [ ] ✅ Docker container starts and Storybook accessible at localhost:6006
- [ ] ✅ Hot-reload latency < 2 seconds for theme/component changes
- [ ] ✅ Build time for initial image < 3 minutes
- [ ] ✅ Rebuild time after code changes < 30 seconds
- [ ] ✅ No functional differences between local and Docker environments

## Issues Found

Document any issues encountered during validation:

1. **Issue**:
   **Resolution**:

2. **Issue**:
   **Resolution**:

## Performance Comparison

Optional: Compare local vs Docker performance

| Metric | Local | Docker | Notes |
|--------|-------|--------|-------|
| Initial startup | | | |
| Hot-reload (theme) | | | |
| Hot-reload (component) | | | |
| Memory usage | | | |

## Notes

Add any observations or recommendations:

---

**Validation Date**: _________________

**Validated By**: _________________

**Docker Version**: _________________

**OS**: _________________

**Overall Status**: [ ] PASS  [ ] FAIL  [ ] PASS WITH ISSUES
