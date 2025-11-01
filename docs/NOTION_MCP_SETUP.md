# Notion MCP Setup Guide

## Overview

This guide will help you set up the Notion Model Context Protocol (MCP) server to enable Claude to interact with your Notion workspace directly.

## Prerequisites

- A Notion account
- Access to create Notion integrations
- Claude Code or Conductor installed

## Step 1: Create a Notion Integration

1. **Go to Notion Integrations**
   - Visit: https://www.notion.so/my-integrations
   - Click **"+ New integration"**

2. **Configure Your Integration**
   - **Name**: Choose a descriptive name (e.g., "Claude Code MCP")
   - **Associated workspace**: Select your workspace
   - **Type**: Internal integration
   - **Capabilities**:
     - ✅ Read content
     - ✅ Update content
     - ✅ Insert content
     - ✅ Read comments (optional)
     - ✅ Insert comments (optional)

3. **Get Your Integration Token**
   - After creating, you'll see an **"Internal Integration Token"**
   - Click **"Show"** and copy the token
   - Format: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Keep this secret!** Never commit it to git

## Step 2: Share Pages with Your Integration

Important: Notion integrations only have access to pages you explicitly share with them.

1. **Open a Notion page** you want Claude to access
2. Click the **"⋯"** menu in the top-right
3. Scroll down to **"Connections"** or **"Add connections"**
4. Select your integration name (e.g., "Claude Code MCP")
5. Click **"Confirm"**

Repeat this for any page or database you want the MCP to access. Child pages inherit access automatically.

## Step 3: Configure MCP Server

### Option A: Using NPX (Recommended)

The official Notion MCP server can be run via npx. Add this to your `.mcp.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "your_notion_integration_token_here"
      }
    }
  }
}
```

### Option B: Environment Variable (More Secure)

1. **Create/Update `.env.local`** in your project root:
   ```bash
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Update `.mcp.json`** to reference the environment variable:
   ```json
   {
     "mcpServers": {
       "notion": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-notion"],
         "env": {
           "NOTION_API_KEY": "${NOTION_API_KEY}"
         }
       }
     }
   }
   ```

3. **Make sure `.env.local` is in `.gitignore`** (it should be already)

## Step 4: Authenticate in Claude Code

1. **Restart Claude Code/Conductor** to pick up the new configuration
2. **Run the MCP command**:
   ```bash
   claude /mcp
   ```
3. **Select Notion** from the list
4. Verify the connection is working

## Step 5: Test the Connection

Try asking Claude:

- "List my Notion pages"
- "Show me the databases in my Notion workspace"
- "Create a new page in Notion titled 'Test Page'"

## Configuration Files

### `.mcp.json` (Committed to Git)
Defines which MCP servers are available for this project.

### `.env.local` (NOT committed)
Contains your secret Notion integration token. Always in `.gitignore`.

### `~/.claude.json` (User Config)
Contains user-level MCP settings and authentication state.

## Common Issues

### "Integration not found" or "No pages accessible"

**Cause**: You haven't shared any pages with your integration.

**Solution**: Go to Notion, click "⋯" on a page, add your integration under "Connections".

### "Unauthorized" or "401 Error"

**Cause**: Invalid or expired integration token.

**Solution**:
1. Go to https://www.notion.so/my-integrations
2. Select your integration
3. Regenerate the token or create a new integration
4. Update your `.env.local` or `.mcp.json` with the new token

### "Command not found: npx"

**Cause**: Node.js is not installed or not in PATH.

**Solution**: Install Node.js from https://nodejs.org/

## Available Notion MCP Capabilities

Once configured, Claude can:

- ✅ **Read** pages, databases, and blocks
- ✅ **Search** your Notion workspace
- ✅ **Create** new pages and databases
- ✅ **Update** existing content
- ✅ **Query** databases with filters
- ✅ **Add comments** to pages (if enabled)

## Security Best Practices

1. **Never commit** `.env.local` or tokens to git
2. **Use environment variables** for sensitive data
3. **Only share necessary pages** with your integration
4. **Regularly rotate** integration tokens
5. **Review integration permissions** periodically at https://www.notion.so/my-integrations

## Example Workflows

See `examples/notion-mcp-workflows.md` for practical examples of using Notion MCP with Claude.

## Troubleshooting

### Check MCP Status
```bash
claude /mcp
```

### Verify Environment Variables
```bash
# Check if token is set (will show "secret_...")
echo $NOTION_API_KEY
```

### Test Integration Directly
Visit your integration page at https://www.notion.so/my-integrations and verify:
- Integration is active
- Token is valid
- Workspace is correct

## Next Steps

1. ✅ Create your Notion integration
2. ✅ Copy the integration token
3. ✅ Add token to `.env.local`
4. ✅ Update `.mcp.json` configuration
5. ✅ Share Notion pages with your integration
6. ✅ Restart Claude Code and test

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [MCP Notion Server](https://github.com/modelcontextprotocol/servers/tree/main/src/notion)
- [Notion Integration Guide](https://www.notion.so/help/create-integrations-with-the-notion-api)
