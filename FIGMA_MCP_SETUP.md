# Figma MCP Setup Guide

## Quick Setup (For Reinstalls)

When setting up Figma MCP after a Conductor reinstall, follow these steps:

### Prerequisites
1. Figma Desktop app is open
2. A Figma file is open in Dev Mode (press `Shift+D`)
3. MCP server is enabled in the Inspect panel

### Setup Steps

```bash
# 1. Navigate to workspace
cd /Users/[username]/Github/design-system-lab/.conductor/[workspace-name]

# 2. Remove incorrect config if it exists
claude mcp remove figma-dev-mode-mcp-server

# 3. Add correct Figma MCP configuration
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# 4. Verify configuration
claude mcp list
# Should show: figma-desktop: http://127.0.0.1:3845/mcp (HTTP) - ✓ Connected
```

### Critical Step: Full Conductor Restart

**You MUST quit Conductor completely for tools to become available:**

1. Press `Cmd+Q` (or Conductor → Quit Conductor)
2. Wait for application to fully close
3. Reopen Conductor from Applications
4. Return to your workspace

### Verification

After restart, test that Figma MCP tools are available:

```typescript
// Test: Get design context from selected Figma node
mcp__figma-desktop__get_design_context({
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

If this returns code, the setup is complete!

## Known Issues

### Issue: `figma-dev-mode-mcp-server` keeps reappearing

**Symptom:** After restart, `claude mcp list` shows both:
- `figma-dev-mode-mcp-server: http://127.0.0.1:3845/sse (SSE) - ✗ Failed to connect`
- `figma-desktop: http://127.0.0.1:3845/mcp (HTTP) - ✓ Connected`

**Why:** Conductor may have a built-in incorrect Figma MCP configuration that persists in global settings.

**Solution:** The tools will still work with `figma-desktop` even if the incorrect config appears. Just ensure `figma-desktop` shows as "✓ Connected" and ignore the failed SSE connection.

If tools don't work:
1. Remove the incorrect config again: `claude mcp remove figma-dev-mode-mcp-server`
2. Do another full Conductor restart (Cmd+Q → Reopen)

## Why This Setup is Required

- **Wrong Endpoint:** The incorrect config uses `/sse` endpoint instead of `/mcp`
- **Transport Type:** Must use `http` transport, not `sse`
- **App Restart Required:** Conductor loads MCP tool registrations at application launch, not workspace launch
- **`claude mcp list` vs Tools:** A server showing "✓ Connected" doesn't mean tools are available until after full app restart

## Available Figma MCP Tools

Once configured:
- `mcp__figma-desktop__get_design_context` - Generate code from Figma selections
- `mcp__figma-desktop__get_variable_defs` - Extract design tokens
- `mcp__figma-desktop__get_screenshot` - Capture screenshots
- `mcp__figma-desktop__get_metadata` - Get node structure as XML
- `mcp__figma-desktop__get_code_connect_map` - Map Figma to codebase components
- `mcp__figma-desktop__create_design_system_rules` - Generate design system rules
- `mcp__figma-desktop__get_figjam` - Extract FigJam content

## Reference

For detailed troubleshooting, see `FIGMA_MCP_TROUBLESHOOTING_REPORT.md` in this workspace.

**Last Updated:** October 31, 2025
