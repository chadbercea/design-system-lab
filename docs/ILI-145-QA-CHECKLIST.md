# ILI-145 QA Testing Checklist

## 🧪 Quality Assurance Testing for SidePanel with Contextual Tabs

**Branch:** `chadbercea/ili-143-app-shell-core-components-week-1`
**Commit:** `97a3dd6`
**Dev Server:** http://localhost:3000

---

## 📋 Test Environment Setup

- [ ] Development server is running (`npm run dev`)
- [ ] Browser is open at http://localhost:3000
- [ ] No console errors on initial load
- [ ] ImageSelectorModal appears on first launch

---

## 🎯 Core SidePanel Functionality

### Panel Behavior
- [ ] **Panel opens** when clicking "Logs ▼" button in TopBar
- [ ] **Panel slides in smoothly** from right side (300ms animation)
- [ ] **Panel width** is approximately 450-500px
- [ ] **Panel overlays** the Canvas3D (3D container remains full viewport size)
- [ ] **Close button** (X) in header closes the panel
- [ ] **Panel closes smoothly** with slide-out animation
- [ ] **Panel header** shows "Container Details" title

### Tab Navigation
- [ ] **4 tabs visible** in tab bar: Logs, Histogram, Ports, Actions
- [ ] **Clicking each tab** switches content correctly
- [ ] **Active tab** has visual indicator (blue underline/highlight)
- [ ] **Tab content** fills available vertical space
- [ ] **Tab switching** is instant (no lag)

---

## 📝 Tab 1: Logs Tab

### Initial State
- [ ] Shows **empty state** when container is stopped/idle
- [ ] Empty state message: "No logs available / Start the container to see logs"

### Active Container (running/building)
- [ ] **Log entries appear** when container is running/building
- [ ] **Entry count** displays in header (e.g., "150 entries")
- [ ] **"Live" badge** shows with pulsing dot indicator
- [ ] **Logs auto-scroll** to bottom as new entries arrive
- [ ] **Monospace font** is used for log text
- [ ] **Timestamps** show in HH:MM:SS format
- [ ] **Log levels** are color-coded:
  - [ ] INFO: Blue text
  - [ ] WARN: Yellow text
  - [ ] ERROR: Red text
  - [ ] DEBUG: Gray text
- [ ] **Scrolling manually** up stops auto-scroll temporarily
- [ ] **Log messages** are readable and properly formatted

---

## 📊 Tab 2: Histogram Tab

### Initial State
- [ ] Shows **empty state** when container is not running
- [ ] Empty state message: "No telemetry data / Start the container to see metrics"

### Active Container (running)
- [ ] **Event count** displays in header
- [ ] **"Active" badge** shows with pulsing dot
- [ ] **Stats summary** displays: Total, Success, Error, Avg duration
- [ ] **Events appear** in reverse chronological order (newest first)
- [ ] **Event cards** show:
  - [ ] Type indicator dot (color-coded: http=blue, db=green, cache=purple, custom=gray)
  - [ ] Event type (capitalized)
  - [ ] Timestamp (HH:MM:SS format)
  - [ ] Duration in milliseconds
  - [ ] Status (success in green, error in red)
- [ ] **Event metadata** expands to show additional details
- [ ] **Stats update** as new events arrive
- [ ] **Success/Error counts** match visual event statuses

---

## 🔌 Tab 3: Ports Tab

### No Ports Configured
- [ ] Shows **empty state** message
- [ ] Message reads: "No exposed ports / Configure port mappings in container settings"

### With Ports Configured
- [ ] **Port count** displays in header
- [ ] **Port mappings** show format: `containerPort/protocol → localhost:hostPort`
- [ ] **Status badges** display correctly:
  - [ ] Working: Green with checkmark icon
  - [ ] Failed: Red with X icon
  - [ ] Pending: Gray with clock icon
- [ ] **Copy URL button**:
  - [ ] Disabled when container not running
  - [ ] Enabled when container running
  - [ ] Shows "Copied!" feedback when clicked
  - [ ] Actually copies localhost URL to clipboard
- [ ] **Open button**:
  - [ ] Disabled when container not running
  - [ ] Disabled when port status is "failed" or "pending"
  - [ ] Enabled when running AND status is "working"
  - [ ] Opens localhost URL in new browser tab
- [ ] **Failed port mappings** show error message below
- [ ] Error message reads: "Port X is already in use by another process"

---

## ⚡ Tab 4: Actions Tab

### Quick Actions Section
- [ ] **Restart Container** button:
  - [ ] Enabled when container is running OR error state
  - [ ] Disabled in other states
  - [ ] Shows confirmation dialog when clicked
  - [ ] Dialog has Cancel and Restart buttons
- [ ] **Pause** button:
  - [ ] Enabled only when container is running
  - [ ] Disabled in other states
  - [ ] Shows confirmation dialog
- [ ] **Stop** button:
  - [ ] Enabled when container is running OR building
  - [ ] Disabled in other states
  - [ ] Shows confirmation dialog

### Destructive Actions Section
- [ ] **Section labeled** "Destructive Actions"
- [ ] **Remove Container** button:
  - [ ] Has red styling (red border, red text)
  - [ ] Enabled when container is stopped OR error
  - [ ] Disabled in other states
  - [ ] Shows confirmation dialog with red title
  - [ ] Dialog warns: "This action cannot be undone"

### Configuration Section
- [ ] **Section labeled** "Configuration"
- [ ] **Save Configuration** button:
  - [ ] Enabled when config exists
  - [ ] Disabled when no config
  - [ ] Shows confirmation dialog
  - [ ] Helper text: "Save current settings for quick container recreation"

### Confirmation Dialogs
- [ ] **All dialogs** have proper dark theme styling (zinc-900 background)
- [ ] **Dialog titles** are clear and descriptive
- [ ] **Dialog descriptions** explain what will happen
- [ ] **Cancel button** closes dialog without action
- [ ] **Confirm button** executes action and closes dialog
- [ ] **Clicking outside** dialog closes it (Cancel behavior)

---

## 🚨 Auto-Open on Error Behavior

### Error State Triggering
- [ ] **Start with panel closed** (close it manually if open)
- [ ] **Trigger container error** (change status to 'error' via actions or state)
- [ ] **Panel automatically opens**
- [ ] **Logs tab is automatically selected**
- [ ] **Error logs** are visible (if available)

### User Control Preservation
- [ ] **Close panel manually** after auto-open
- [ ] **Panel stays closed** (respects user's choice)
- [ ] **Panel doesn't re-open** if error state persists
- [ ] **Panel only re-opens** if status changes FROM non-error TO error again

---

## 🎨 Visual Design & Styling

### Panel Appearance
- [ ] **Background color** is zinc-900 (dark gray)
- [ ] **Border** is 1px solid zinc-800 (darker gray)
- [ ] **Drop shadow** provides depth
- [ ] **Text** is legible against dark background
- [ ] **Tab bar** has clean separation from content

### Typography
- [ ] **Logs tab** uses monospace font
- [ ] **Timestamps** are consistently formatted
- [ ] **Font sizes** are appropriate and readable
- [ ] **Line heights** provide good readability

### Colors & Badges
- [ ] **Color coding** is consistent across tabs
- [ ] **Badge indicators** (Live, Active) are visible
- [ ] **Status icons** render correctly
- [ ] **Button hover states** work (zinc-800 → zinc-700)
- [ ] **Active tab** highlight is visible

---

## 📱 Responsive Behavior

### Viewport Height Changes
- [ ] **Panel height** adapts to browser window resize
- [ ] **Content areas** remain scrollable at all heights
- [ ] **Tab bar** stays fixed at top of panel
- [ ] **Close button** remains accessible

### Content Overflow
- [ ] **Long log messages** wrap appropriately
- [ ] **Many log entries** scroll without breaking layout
- [ ] **Many histogram events** scroll without breaking layout
- [ ] **Scrollbars** appear when content overflows
- [ ] **Scroll behavior** is smooth

---

## 🔄 State Management Integration

### App State Consistency
- [ ] **Panel state** persists across tab switches
- [ ] **Active tab** remembered when reopening panel
- [ ] **Container status changes** reflect in all tabs
- [ ] **Closing panel** updates `panelOpen` state
- [ ] **Tab changes** update `activeTab` state

### Mock Data Hooks
- [ ] **useMockLogs** starts streaming when Logs tab active
- [ ] **useMockHistogram** starts generating events when Histogram tab active
- [ ] **Hooks stop** when tabs become inactive (check console for cleanup)
- [ ] **Data persists** when switching tabs and coming back

---

## ⚠️ Error Handling

### Edge Cases
- [ ] **No selected image**: Panel still opens/closes correctly
- [ ] **No port mappings**: Empty state displays properly
- [ ] **Container in unexpected state**: Buttons disable appropriately
- [ ] **Rapid tab switching**: No visual glitches
- [ ] **Rapid open/close**: Animation doesn't break

### Console Check
- [ ] **No JavaScript errors** in browser console
- [ ] **No React warnings** about keys, hooks, etc.
- [ ] **No TypeScript errors** displayed
- [ ] **Network tab** shows no failed requests

---

## 🚀 Performance

### Animation Performance
- [ ] **Panel slide-in** is smooth (60fps)
- [ ] **Panel slide-out** is smooth (60fps)
- [ ] **Tab switching** is instant
- [ ] **Log streaming** doesn't cause stuttering
- [ ] **Histogram updates** don't lag

### Memory & CPU
- [ ] **CPU usage** stays reasonable with panel open
- [ ] **Memory** doesn't continuously grow
- [ ] **Streams clean up** when panel closes (check browser dev tools)
- [ ] **No memory leaks** after opening/closing multiple times

---

## ✅ Integration with Existing Components

### TopBar Integration
- [ ] **"Logs ▼" button** opens panel correctly
- [ ] **Button styling** matches design system
- [ ] **Container status badge** updates correctly
- [ ] **TopBar remains functional** with panel open

### Canvas3D Integration
- [ ] **3D container** remains visible behind panel
- [ ] **3D container** maintains full viewport size
- [ ] **OrbitControls** still work with panel open
- [ ] **Container animations** continue with panel open

### BottomBar Integration
- [ ] **BottomBar** remains visible with panel open
- [ ] **Stats display** continues updating
- [ ] **Status indicator** reflects current state
- [ ] **Localhost URL** is clickable

---

## 🐛 Known Issues to Document

**List any bugs found during testing:**

1. [ ] Issue: _________________________________
   - Steps to reproduce: _________________________________
   - Expected: _________________________________
   - Actual: _________________________________
   - Severity: [ ] Critical [ ] Major [ ] Minor [ ] Cosmetic

2. [ ] Issue: _________________________________
   - Steps to reproduce: _________________________________
   - Expected: _________________________________
   - Actual: _________________________________
   - Severity: [ ] Critical [ ] Major [ ] Minor [ ] Cosmetic

---

## 📸 Screenshots/Videos to Capture

- [ ] Panel closed state (full 3D viewport)
- [ ] Panel open with Logs tab (streaming logs)
- [ ] Panel open with Histogram tab (events visible)
- [ ] Panel open with Ports tab (port mappings shown)
- [ ] Panel open with Actions tab (all buttons visible)
- [ ] Auto-open behavior (before/after error state)
- [ ] Confirmation dialog example
- [ ] Mobile/small viewport (if applicable)

---

## ✍️ Final Sign-Off

**Tested By:** _________________________________
**Date:** _________________________________
**Browser:** _________________________________
**OS:** _________________________________

**Overall Status:**
- [ ] ✅ All tests passed - Ready for production
- [ ] ⚠️ Minor issues found - Document and decide
- [ ] ❌ Major issues found - Needs fixes before approval

**Additional Notes:**
_________________________________
_________________________________
_________________________________

---

## 🎯 Test Coverage Summary

**Total Test Items:** 150+
**Categories Covered:** 13
- Core Functionality
- Logs Tab
- Histogram Tab
- Ports Tab
- Actions Tab
- Auto-Open Behavior
- Visual Design
- Responsive Behavior
- State Management
- Error Handling
- Performance
- Integration
- Bug Tracking

**Estimated Testing Time:** 45-60 minutes for thorough coverage
