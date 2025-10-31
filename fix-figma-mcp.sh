#!/bin/bash
# Fix Figma MCP endpoint from /sse to /mcp

echo "🔧 Fixing Figma MCP endpoint..."
echo ""

# Remove the incorrect built-in config from workspace level
echo "1. Removing incorrect figma-dev-mode-mcp-server (workspace level)..."
claude mcp remove figma-dev-mode-mcp-server 2>/dev/null || echo "   (not found - that's ok)"

# Remove the incorrect built-in config from global user level
echo ""
echo "2. Removing incorrect figma-dev-mode-mcp-server (global user level)..."
(cd ~ && claude mcp remove figma-dev-mode-mcp-server 2>/dev/null) || echo "   (not found - that's ok)"

# Remove any existing figma-desktop config to start fresh
echo ""
echo "3. Removing existing figma-desktop config..."
claude mcp remove figma-desktop 2>/dev/null || echo "   (not found - that's ok)"

# Add the correct configuration
echo ""
echo "4. Adding correct Figma MCP configuration..."
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# Verify
echo ""
echo "✅ Configuration updated. Current status:"
claude mcp list | grep figma

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  CRITICAL NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. You MUST fully restart Conductor (Cmd+Q) for tools to work"
echo "2. DO NOT click 'Enable Figma MCP' button in UI - it re-adds the broken config"
echo "3. If you accidentally click it, just run this script again"
echo ""
echo "The figma-desktop connection is what you want (✓ Connected)"
echo "Ignore any figma-dev-mode-mcp-server failures"
echo ""
