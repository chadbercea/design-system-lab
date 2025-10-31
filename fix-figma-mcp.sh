#!/bin/bash
# Fix Figma MCP endpoint from /sse to /mcp

echo "🔧 Fixing Figma MCP endpoint..."

# Remove the incorrect built-in config
echo "Removing incorrect figma-dev-mode-mcp-server config..."
claude mcp remove figma-dev-mode-mcp-server 2>/dev/null

# Remove any existing figma-desktop config
echo "Removing existing figma-desktop config..."
claude mcp remove figma-desktop 2>/dev/null

# Add the correct configuration
echo "Adding correct Figma MCP configuration..."
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# Verify
echo ""
echo "✅ Configuration updated. Checking connection..."
claude mcp list | grep figma

echo ""
echo "⚠️  IMPORTANT: You MUST fully restart Conductor (Cmd+Q) for tools to be available!"
echo "    Workspace restart is NOT enough - you need a full app restart."
