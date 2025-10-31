# Figma MCP Integration: Complete Troubleshooting Report

**Issue:** ILI-78 - Set up Figma MCP server and connections
**Date:** October 31, 2025
**Workspace:** design-system-lab/.conductor/taipei
**Status:** ✅ RESOLVED

---

## Executive Summary

Setting up Figma MCP integration with Conductor required navigating multiple failures before discovering the correct solution. The root issue was **Conductor workspaces require a full application restart to expose newly configured MCP server tools**, combined with confusion around incorrect built-in MCP configurations.

**Key Finding:** Even when MCP servers show as "✓ Connected" via `claude mcp list`, Conductor workspaces won't expose the tools until the entire Conductor application is quit and restarted (Cmd+Q → Reopen).

---

## Timeline of Events

### Phase 1: Initial Setup Attempts (Saskatoon Workspace)

#### Problem 1: Wrong MCP Endpoint
**What Happened:**
- Saskatoon agent initially configured Figma MCP with wrong endpoint
- Used: `http://127.0.0.1:3845/sse` with SSE transport
- Correct: `http://127.0.0.1:3845/mcp` with HTTP transport

**How We Found It:**
- Official Figma documentation clearly stated the correct endpoint
- Testing with `curl http://127.0.0.1:3845/mcp` returned valid JSON-RPC response
- Testing with `curl http://127.0.0.1:3845/sse` failed

**Fix Applied:**
```bash
# Remove incorrect configuration
claude mcp remove figma-dev-mode-mcp-server

# Add correct configuration
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

**Result:** Server showed as connected in `claude mcp list`, but tools still not available.

---

#### Problem 2: Conductor Workspace MCP Isolation
**What Happened:**
- `claude mcp list` (in terminal) showed Figma MCP as connected
- But MCP tools (`mcp__figma__*`) were NOT available to Saskatoon workspace in Conductor
- Linear and Context7 MCP tools worked fine

**Hypothesis:**
Conductor workspaces have isolated MCP configurations that don't automatically inherit from global `~/.claude.json` config.

**Attempted Solution:**
Created workspace-level MCP configuration file:
```bash
# File: .conductor/saskatoon/.claude/mcp.json
{
  "mcpServers": {
    "figma-desktop": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

**Why It Failed:**
Saskatoon asked user to restart Conductor to test this approach. User restarted, but Saskatoon's session was lost, so we couldn't verify if this worked.

**Status:** Unverified - moved to new workspace.

---

### Phase 2: Fresh Start (Taipei Workspace)

#### Problem 3: Session Lost, Need to Continue
**What Happened:**
- User came back after restart, Saskatoon's session was gone
- User instructed Taipei agent to take over
- All work from Saskatoon needed to be copied to Taipei

**Actions Taken:**
1. Copied all Figma integration code from saskatoon workspace
2. Installed dependencies
3. Verified Figma MCP server was still running

**Discovery:**
Even after copying everything and running `claude mcp add`, the Figma MCP tools were STILL not available to Taipei workspace.

---

#### Problem 4: Incorrect Built-in Figma Configuration
**What Happened:**
After first restart, running `claude mcp list` showed:
```
figma-dev-mode-mcp-server: http://127.0.0.1:3845/sse (SSE) - ✗ Failed to connect
```

**Root Cause:**
Conductor (or Claude Code) had a **built-in/global Figma MCP configuration with the wrong endpoint** (`/sse` instead of `/mcp`). This was separate from our project-level configuration.

**How We Found It:**
- The server name `figma-dev-mode-mcp-server` appeared even though we never added it
- Our manually added `figma-desktop` config wasn't showing up
- Searching `~/.claude.json` showed our correct config existed, but the wrong one kept appearing

**Location of Wrong Config:**
Not in `~/.claude.json` - likely in Conductor's built-in configuration or cache.

**Attempted Fix:**
```bash
# Try to remove the wrong config
claude mcp remove figma-dev-mode-mcp-server
# Error: No MCP server found with name: "figma-dev-mode-mcp-server"
```

This confirmed the wrong config was NOT in the user's config file - it was coming from Conductor itself.

---

#### Problem 5: Configuration Present But Tools Not Available
**What Happened:**
- Verified `~/.claude.json` contained correct Figma MCP configuration for taipei workspace:
```json
"/Users/chadbercea/Github/design-system-lab/.conductor/taipei": {
  "mcpServers": {
    "figma-desktop": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```
- `claude mcp list` showed `figma-desktop: ✓ Connected`
- But `mcp__figma__*` tools were STILL not available in Conductor workspace

**Critical Discovery:**
Conductor workspaces don't automatically pick up MCP tools even when:
1. MCP server is connected
2. Configuration is correct in `~/.claude.json`
3. `claude mcp list` shows ✓ Connected

---

### Phase 3: The Solution

#### Problem 6: Workspace Restart Insufficient
**What Happened:**
- User came back after "restarting Conductor" (workspace restart)
- Wrong config `figma-dev-mode-mcp-server` with `/sse` endpoint appeared again
- Tools still not available

**Action Taken:**
```bash
# Remove the persistent wrong config (from global level)
claude mcp remove figma-dev-mode-mcp-server
# Success: Removed MCP server "figma-dev-mode-mcp-server" from user config

# Re-add correct config
claude mcp remove figma-desktop
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# Verify
claude mcp list
# figma-desktop: http://127.0.0.1:3845/mcp (HTTP) - ✓ Connected
```

**Result:** Server connected, but tools STILL not available to workspace.

---

#### The Critical Realization

**What We Understood:**
Linear and Context7 MCP tools were working because they're likely **built-in to Conductor**. Custom MCP servers added via `claude mcp add` show as connected but their tools aren't exposed to workspaces without a **full application restart**.

#### The Final Solution

**What Worked:**
1. User **quit Conductor entirely** (Cmd+Q, not just closing workspace)
2. Reopened Conductor application
3. Returned to taipei workspace
4. Tested Figma MCP tools

**Result:**
```bash
claude mcp list
# figma-desktop: http://127.0.0.1:3845/mcp (HTTP) - ✓ Connected
```

**Tools Now Available:**
- ✅ `mcp__figma-desktop__get_design_context` - WORKS
- ✅ `mcp__figma-desktop__get_variable_defs` - WORKS
- ✅ `mcp__figma-desktop__get_screenshot` - Available
- ✅ `mcp__figma-desktop__get_metadata` - Available
- ✅ `mcp__figma-desktop__get_code_connect_map` - Available
- ✅ `mcp__figma-desktop__create_design_system_rules` - Available
- ✅ `mcp__figma-desktop__get_figjam` - Available

---

## Root Cause Analysis

### Why It Failed Multiple Times

1. **Wrong Initial Configuration:** `/sse` endpoint instead of `/mcp`
2. **Conductor Built-in Config:** A pre-existing incorrect Figma MCP config in Conductor that persisted
3. **Workspace vs Application Restart:** Restarting just the workspace didn't reload MCP tool registrations
4. **Tool Exposure Timing:** MCP servers can connect and show ✓ Connected, but tools aren't exposed to workspaces until app restart

### The Actual Problem

**Conductor's MCP tool registration happens at application launch, not workspace launch.**

When you add a new MCP server via `claude mcp add`:
1. ✅ Config gets written to `~/.claude.json` immediately
2. ✅ `claude mcp list` can test the connection immediately
3. ❌ **Tools are NOT available to existing Conductor sessions**
4. ✅ **Tools ONLY become available after full app restart**

This is different from CLI usage where MCP tools are available immediately after `claude mcp add`.

---

## The Complete Working Solution

### Prerequisites
1. ✅ Figma Pro account (or appropriate plan)
2. ✅ Figma Desktop application installed
3. ✅ Figma file open in Desktop app
4. ✅ Dev Mode enabled (Shift+D in Figma)
5. ✅ MCP server enabled in Figma's Inspect panel
6. ✅ Conductor installed and running

### Step-by-Step Setup

#### 1. Verify Figma MCP Server is Running

Open Figma Desktop:
- Open any design file
- Press `Shift+D` to enter Dev Mode
- In Inspect panel, look for "MCP server" section
- Click "Enable desktop MCP server"
- Verify you see confirmation message

Test the server:
```bash
curl http://127.0.0.1:3845/mcp
# Should return: {"jsonrpc":"2.0","error":{"code":-32001,"message":"Invalid sessionId"},"id":null}
# This error is expected - it confirms the server is running
```

#### 2. Navigate to Your Conductor Workspace

```bash
cd /Users/[username]/Github/[project]/.conductor/[workspace-name]
```

#### 3. Add Figma MCP Server Configuration

```bash
# Remove any existing incorrect configurations first
claude mcp remove figma-dev-mode-mcp-server 2>/dev/null
claude mcp remove figma-desktop 2>/dev/null

# Add the correct configuration
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

Expected output:
```
Added HTTP MCP server figma-desktop with URL: http://127.0.0.1:3845/mcp to local config
File modified: /Users/[username]/.claude.json [project: /Users/[username]/Github/[project]/.conductor/[workspace-name]]
```

#### 4. Verify Configuration

```bash
claude mcp list
```

Expected output:
```
figma-desktop: http://127.0.0.1:3845/mcp (HTTP) - ✓ Connected
```

#### 5. **CRITICAL STEP: Full Conductor Restart**

**Do NOT just close the workspace or terminal. You MUST fully quit Conductor:**

1. Click on Conductor in menu bar (or bring app to focus)
2. Press `Cmd+Q` (or Conductor → Quit Conductor)
3. Wait for application to fully close
4. Reopen Conductor application
5. Navigate back to your workspace

#### 6. Verify MCP Tools Are Available

In Conductor workspace, test the tools:

```typescript
// Test 1: Get design context (generates code)
mcp__figma-desktop__get_design_context({
  clientLanguages: "typescript",
  clientFrameworks: "react"
})

// Test 2: Get design tokens
mcp__figma-desktop__get_variable_defs({
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

Both should return data without errors.

---

## Common Pitfalls & How to Avoid Them

### ❌ Pitfall 1: Using Wrong Endpoint
**Wrong:**
```bash
claude mcp add --transport sse figma-desktop http://127.0.0.1:3845/sse
```

**Correct:**
```bash
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

### ❌ Pitfall 2: Workspace Restart Instead of App Restart
**Wrong:**
- Closing and reopening workspace
- Restarting terminal/shell
- Running `conductor restart workspace`

**Correct:**
- `Cmd+Q` to quit entire Conductor application
- Reopen Conductor from Applications folder or Spotlight

### ❌ Pitfall 3: Forgetting Dev Mode
**Problem:** Figma MCP server only runs when Figma Desktop is in Dev Mode

**Solution:**
- Open Figma Desktop
- Press `Shift+D` to enter Dev Mode
- Keep Figma in Dev Mode while using MCP tools

### ❌ Pitfall 4: Assuming Connection = Tools Available
**Problem:** `claude mcp list` showing "✓ Connected" does NOT mean tools are available in workspace

**Solution:**
- Always do full app restart after `claude mcp add`
- Test tool availability by actually calling a tool, don't just check `mcp list`

---

## Verification Checklist

Use this checklist every time you set up Figma MCP in a new Conductor workspace:

- [ ] Figma Desktop is open
- [ ] Design file is open in Figma
- [ ] Dev Mode is active (Shift+D)
- [ ] MCP server is enabled in Inspect panel
- [ ] `curl http://127.0.0.1:3845/mcp` returns JSON-RPC error (confirms server running)
- [ ] Navigated to correct Conductor workspace directory
- [ ] Ran `claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp`
- [ ] Verified config in `~/.claude.json` for workspace path
- [ ] `claude mcp list` shows `figma-desktop: ✓ Connected`
- [ ] **Quit Conductor completely (Cmd+Q)**
- [ ] Reopened Conductor
- [ ] Navigated back to workspace
- [ ] Tested `mcp__figma-desktop__get_design_context` - returns code
- [ ] Tested `mcp__figma-desktop__get_variable_defs` - returns tokens

---

## Technical Details

### Configuration Storage

When you run `claude mcp add`, the configuration is stored in `~/.claude.json` with project-level scoping:

```json
{
  "/Users/[username]/Github/[project]/.conductor/[workspace]": {
    "mcpServers": {
      "figma-desktop": {
        "type": "http",
        "url": "http://127.0.0.1:3845/mcp"
      }
    }
  }
}
```

### Why Full Restart Is Required

**Hypothesis (based on observed behavior):**

1. Conductor loads MCP configurations at application startup
2. It registers available tools for each workspace based on MCP servers
3. Adding a new MCP server via CLI updates the config file
4. But Conductor doesn't reload tool registrations until app restart
5. The `claude mcp list` command tests connections independently of tool registration

This is why:
- `claude mcp list` shows "✓ Connected" immediately
- But `mcp__figma__*` tools aren't available until restart

### Comparison to Claude CLI

In regular Claude CLI (not Conductor):
- MCP tools are available immediately after `claude mcp add`
- No restart required

**The key difference:** Conductor manages multiple workspace sessions simultaneously and likely caches tool registrations for performance.

---

## Available Figma MCP Tools

Once properly configured, these tools are available:

### 1. `get_design_context`
**Purpose:** Generate code from Figma selections

**Parameters:**
- `nodeId` (optional): Specific node ID to generate code for
- `clientLanguages`: Programming language (e.g., "typescript")
- `clientFrameworks`: Framework (e.g., "react", "vue")
- `forceCode` (optional): Always return code even if large

**Returns:** React/Vue/etc. component code with styling

**Usage:**
```typescript
mcp__figma-desktop__get_design_context({
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

### 2. `get_variable_defs`
**Purpose:** Extract design tokens/variables from selection

**Parameters:**
- `nodeId` (optional): Specific node ID
- `clientLanguages`: Programming language
- `clientFrameworks`: Framework

**Returns:** JSON object with design tokens (colors, typography, spacing)

**Usage:**
```typescript
mcp__figma-desktop__get_variable_defs({
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

### 3. `get_screenshot`
**Purpose:** Capture screenshot of selection

**Parameters:**
- `nodeId` (optional): Specific node ID
- `clientLanguages`: Programming language
- `clientFrameworks`: Framework

**Returns:** Screenshot image URL

### 4. `get_metadata`
**Purpose:** Get XML structure with layer IDs, names, types, positions

**Parameters:**
- `nodeId` (optional): Specific node ID
- `clientLanguages`: Programming language
- `clientFrameworks`: Framework

**Returns:** XML representation of node structure

**Use Case:** For large designs where full code generation is too verbose

### 5. `get_code_connect_map`
**Purpose:** Get mappings between Figma nodes and codebase components

**Parameters:**
- `nodeId` (optional): Specific node ID
- `clientLanguages`: Programming language
- `clientFrameworks`: Framework

**Returns:** Object mapping node IDs to code component locations

### 6. `create_design_system_rules`
**Purpose:** Generate design system rules file

**Parameters:**
- `clientLanguages`: Programming language
- `clientFrameworks`: Framework

**Returns:** Rules file content for maintaining design system consistency

### 7. `get_figjam`
**Purpose:** Extract FigJam diagram content

**Parameters:**
- `nodeId` (optional): Specific node ID
- `clientLanguages`: Programming language
- `clientFrameworks`: Framework
- `includeImagesOfNodes` (optional): Include node screenshots

**Returns:** FigJam content as XML with metadata

---

## Troubleshooting Guide

### Problem: `figma-desktop: ✗ Failed to connect`

**Possible Causes:**
1. Figma Desktop not running
2. Not in Dev Mode
3. Wrong endpoint URL

**Solutions:**
```bash
# 1. Check if Figma is running and in Dev Mode
# Open Figma Desktop, press Shift+D

# 2. Test endpoint directly
curl http://127.0.0.1:3845/mcp
# Should return JSON-RPC error (confirms running)

# 3. Remove and re-add with correct URL
claude mcp remove figma-desktop
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# 4. Full Conductor restart
# Cmd+Q → Reopen
```

### Problem: Server connected but tools not available

**Solution:**
You forgot the full application restart. Quit Conductor completely (Cmd+Q) and reopen.

### Problem: `figma-dev-mode-mcp-server` appears with wrong URL

**Cause:** Conductor has a built-in Figma config that's incorrect

**Solution:**
```bash
# Remove the incorrect built-in config
claude mcp remove figma-dev-mode-mcp-server

# Add correct config
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# Full restart
# Cmd+Q → Reopen
```

### Problem: Tools return "Invalid sessionId" error

**Cause:** Figma MCP server requires a file to be open and selected in Dev Mode

**Solution:**
1. Open a Figma file in Figma Desktop
2. Select a frame or component
3. Ensure you're in Dev Mode (Shift+D)
4. Try the tool call again

### Problem: Configuration in `~/.claude.json` but tools still not available

**Cause:** Configuration is correct, but workspace hasn't loaded it

**Solution:**
Full Conductor application restart (Cmd+Q → Reopen)

---

## Summary: The Minimal Working Setup

For anyone setting this up fresh, here's the minimal process:

```bash
# 1. Ensure Figma Desktop is open in Dev Mode with a file
# (Open Figma, open file, press Shift+D, enable MCP server in Inspect panel)

# 2. Navigate to workspace
cd /path/to/.conductor/workspace

# 3. Add MCP server
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# 4. Quit Conductor (Cmd+Q)

# 5. Reopen Conductor

# 6. Test
# In Conductor workspace, try calling:
# mcp__figma-desktop__get_design_context or get_variable_defs
```

**That's it.** The full restart is the critical step that was missed multiple times during troubleshooting.

---

## Lessons Learned

1. **MCP tool registration is per-application-launch, not per-workspace-launch**
2. **`claude mcp list` connection status ≠ tool availability in workspace**
3. **Full app restart (Cmd+Q) is required, workspace restart is insufficient**
4. **Conductor may have built-in MCP configs that conflict with manual configs**
5. **Always test tool availability by calling tools, not just checking connection**
6. **Documentation should explicitly state restart requirements**

---

## Future Improvements

### For Conductor Team
- Add warning when `claude mcp add` is used: "Restart Conductor to enable new tools"
- Hot-reload MCP configurations without requiring full restart
- Clear distinction between "server connected" and "tools available"
- UI for managing MCP servers per-workspace

### For This Project
- Automate MCP setup check in CI/CD
- Add health check script that verifies all tools are available
- Document this process in main README
- Create setup script that validates each step

---

## Contact Information

**Issue Reference:** ILI-78
**Conductor Support:** humans@conductor.build
**Figma MCP Docs:** https://developers.figma.com/docs/figma-mcp-server/

---

**Document Version:** 1.0
**Last Updated:** October 31, 2025
**Status:** Validated and Working
