# ILI-146: Mock Docker API + Data Fixtures (Week 2) - COMPLETED

**Status:** ✅ Complete
**Branch:** `chadbercea/ili-143-app-shell-core-components-week-1`
**Commit:** `a2ca180f76b68c81e5d0e81c7d5e8f3e7c3f8d4a`

## Summary

Successfully implemented comprehensive mock Docker API layer with realistic data fixtures, streaming simulations, and error scenarios. All integration points clearly marked with TODO comments for Docker Desktop team.

## Deliverables Completed

### 1. Mock Docker API (`src/lib/mock-docker-api.ts`)
- ✅ `fetchImages()` - Docker Hub image list with network simulation
- ✅ `runContainer()` - Container startup with state transitions
- ✅ `stopContainer()` - Stop running containers
- ✅ `getContainerLogs()` - Retrieve container logs
- ✅ `getContainerStats()` - CPU/memory/network metrics
- ✅ `createLogStream()` - Real-time log streaming
- ✅ `createStatsStream()` - Real-time stats updates
- ✅ `simulateContainerStartup()` - Lifecycle state management
- ✅ `checkPortAvailable()` - Port conflict detection
- ✅ `inspectContainer()` - Container details

### 2. Data Fixtures (`src/lib/fixtures/`)

**docker-images.ts** (8 images + sample):
- nginx:latest (142 MB)
- node:20-alpine (178 MB)
- postgres:16 (432 MB)
- redis:alpine (32 MB)
- mysql:8.0 (580 MB)
- python:3.12-slim (125 MB)
- mongo:7 (680 MB)
- rabbitmq:3-management (235 MB)
- hello-world:latest (13.3 MB) - sample image

**container-logs.ts**:
- 13 realistic log entries with timestamps
- Multiple log levels: info, warn, error, debug
- Different sources: docker, app, server, database, middleware
- Streaming log generator
- Error scenario logs (port conflicts)

**container-stats.ts**:
- `generateMockStats()` - Normal operation stats
- `generateBuildingStats()` - High CPU during build
- `generateIdleStats()` - Stopped container
- `generateHeavyLoadStats()` - High resource usage
- `generateStatsTimeSeries()` - Time series for visualization
- Helper formatters for bytes and percentages

### 3. Custom Hooks (`src/hooks/`)

**useMockLogs.ts**:
- Streaming log simulation with auto-cleanup
- Filter logs by level (info/warn/error/debug)
- Filter logs by source
- Clear logs functionality
- Max logs limit (default 1000)
- Loading and error states

**useMockHistogram.ts**:
- Generate telemetry events (HTTP/DB/cache/custom)
- Realistic duration ranges per event type
- Success/error status (90/10 split)
- Event burst behavior (1-3 events at a time)
- Filter by type and status
- Stats calculation (total, success, error, avg/max/min duration)

**useMockEvents.ts**:
- Container lifecycle management
- Start/stop/restart operations
- Event history tracking
- Transition state handling
- Error simulation
- Clear events functionality

### 4. Error Scenarios

**Implemented error cases:**
- Port conflict (10% chance during runContainer)
- Network errors (5% chance during fetchImages)
- Container not found (5% chance for logs/stats)
- Container not running (5% chance for stats)
- Build failures (10% chance during startup)

## Acceptance Criteria Status

- ✅ All mock API functions return realistic data
- ✅ Clear TODO comments for real API integration
- ✅ Mock data covers happy path + error scenarios
- ✅ Hooks simulate real-time behavior (logs streaming, stats updating)
- ✅ Mock delays realistic (building: 15-30s, API calls: 100-500ms)
- ✅ Data fixtures diverse enough for demo purposes
- ✅ TypeScript interfaces match PRD specifications
- ✅ No external API calls (all local simulation)

## Technical Implementation

### API Delays
```typescript
API_DELAY_MIN = 100ms
API_DELAY_MAX = 500ms
BUILD_DELAY_MIN = 15000ms (15 seconds)
BUILD_DELAY_MAX = 30000ms (30 seconds)
```

### Streaming Behavior
- Log stream: New log every 2 seconds
- Stats stream: Stats update every 2 seconds
- Auto-cleanup on unmount
- State-dependent stat generation

### Integration Comments Format
```typescript
/**
 * TODO: Replace with Docker Desktop API call
 * Real API: window.dockerDesktopAPI.containers.run(image, config)
 * Expected response: { containerId: string, state: ContainerStatus }
 * Error handling: Port conflicts, image not found, resource limits
 */
```

## Component Integration

### ImageSelectorModal Updates
**Before:**
- Hardcoded mock images array
- No loading states
- No error handling

**After:**
- Calls `fetchImages()` on modal open
- Loading spinner during API call
- Error message display
- Filters sample image from list

### BottomBar Updates
**Before:**
- Static hardcoded stats
- No real-time updates

**After:**
- Streams stats via `createStatsStream()`
- Updates every 2 seconds
- State-dependent stats (building/running/stopped)
- Automatic cleanup on unmount

## Files Modified/Created

```
9 files changed, 1,125 insertions(+), 52 deletions(-)

New files:
- src/lib/mock-docker-api.ts (372 lines)
- src/lib/fixtures/docker-images.ts (89 lines)
- src/lib/fixtures/container-logs.ts (163 lines)
- src/lib/fixtures/container-stats.ts (146 lines)
- src/hooks/useMockLogs.ts (61 lines)
- src/hooks/useMockHistogram.ts (135 lines)
- src/hooks/useMockEvents.ts (98 lines)

Modified:
- src/components/ImageSelectorModal.tsx (+28, -24 lines)
- src/components/BottomBar.tsx (+33, -11 lines)
```

## Build Status

```
✓ TypeScript compilation successful
✓ Production build passes
✓ All 15 routes generated
✓ No ESLint errors
✓ Mock API integration verified
```

## Mock Data Characteristics

### Docker Images
- 8 diverse common images
- Varying sizes (13MB - 680MB)
- Realistic repository names
- Created dates
- SHA256 image IDs

### Container Logs
- Realistic startup sequence
- Multiple log sources
- Different severity levels
- Timestamps in ISO format
- Typical application messages

### Container Stats
- **Normal operation**: CPU 5-35%, Memory 200-320 MB
- **Building**: CPU 40-70%, Memory 128-192 MB
- **Heavy load**: CPU 75-95%, Memory 700-900 MB
- **Idle/Stopped**: CPU 0%, Memory 0
- Network Rx/Tx with realistic variation

### Histogram Events
- **HTTP**: 50-550ms duration
- **Database**: 20-320ms duration
- **Cache**: 1-51ms duration
- **Custom**: 10-210ms duration
- 90% success, 10% error rate

## Integration Handoff Guide

### Replacing Mock Functions

**Step 1: Replace fetchImages**
```typescript
// Remove:
import { fetchImages } from '@/lib/mock-docker-api';

// Add:
import { fetchImages } from '@/lib/docker-desktop-api';

// Function signature remains the same:
async function fetchImages(): Promise<DockerImage[]>
```

**Step 2: Replace runContainer**
```typescript
// Mock: return { containerId, status }
// Real: window.dockerDesktopAPI.containers.run(image, config)
```

**Step 3: Replace streaming functions**
```typescript
// Mock: createLogStream(containerId, onLog)
// Real: window.dockerDesktopAPI.containers.logsStream(containerId)
```

### Testing Strategy

1. Keep mock API alongside real API initially
2. Feature flag to switch between mock/real
3. A/B test with team members
4. Gradual rollout per function

## Next Steps (Future Tickets)

The following items depend on this mock API:

1. **Canvas3D integration** - Use container status from mock events
2. **SidePanel implementation** - Display logs and histogram from hooks
3. **Container controls** - Wire up start/stop buttons to mock API
4. **Real-time dashboard** - Use stats streaming for live updates
5. **Error handling UI** - Display error scenarios from mock API

## Development Usage

### Using Mock Hooks in Components

```typescript
import { useMockLogs } from '@/hooks/useMockLogs';
import { useMockEvents } from '@/hooks/useMockEvents';

function MyComponent() {
  const { logs, isStreaming } = useMockLogs({
    containerId: 'mock-id',
    enabled: true,
  });

  const { status, startContainer, stopContainer } = useMockEvents({
    containerId: 'mock-id',
  });

  return (/* UI using logs and status */);
}
```

### Simulating Error Scenarios

```typescript
// Port conflict
await runContainer(image, {
  ports: [{ containerPort: 80, hostPort: 3000 }]
}); // 10% chance of error

// Network error
await fetchImages(); // 5% chance of error

// Container not found
await getContainerLogs('invalid-id'); // 5% chance of error
```

## Notes

- All mock functions use Promise-based async patterns
- Realistic delays make the prototype feel production-ready
- Error scenarios help test error handling UI
- TODO comments reference exact Docker Desktop API signatures
- Streaming behavior matches real Docker behavior
- TypeScript strict mode enforced throughout

---

**Implementation Date:** November 5, 2025
**Implemented by:** Claude Code Agent
**Total Lines of Code:** 1,125 lines added
**Carried Forward Context from:** ILI-143 (App Shell + Core Components)
