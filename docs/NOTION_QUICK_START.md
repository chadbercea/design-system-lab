# Notion MCP Quick Start

Get Notion MCP running in 5 minutes! 🚀

## Prerequisites

- Node.js installed (for npx)
- Claude Code or Conductor
- A Notion account

## Quick Setup Steps

### 1. Create Notion Integration (2 minutes)

1. Visit: https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Name it: **"Claude MCP"**
4. Select your workspace
5. Keep default capabilities (Read/Update/Insert content)
6. Click **"Submit"**
7. **Copy the token** (starts with `secret_`)

### 2. Add Token to Environment (30 seconds)

Create `.env.local` in this directory:

```bash
echo 'NOTION_API_KEY=secret_paste_your_token_here' > .env.local
```

Or manually create the file:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Share a Page with Integration (1 minute)

1. Open any Notion page you want Claude to access
2. Click **"⋯"** (top-right)
3. Scroll to **"Connections"**
4. Select **"Claude MCP"** (your integration name)
5. Click **"Confirm"**

**Important:** The integration can only see pages you explicitly share!

### 4. Restart Claude Code (30 seconds)

1. Quit Claude Code/Conductor completely
2. Reopen it
3. The Notion MCP server will start automatically

### 5. Test It! (1 minute)

Ask Claude:

```
List my Notion pages
```

You should see the page(s) you shared!

## What's Already Configured

✅ `.mcp.json` - Already includes Notion server config
✅ `.gitignore` - Already protects `.env.local`
✅ `.env.example` - Template for your token

## Troubleshooting

### "No pages found"
→ You forgot to share pages with your integration. Go back to Step 3.

### "Unauthorized" or "401"
→ Your token is wrong. Check `.env.local` matches your integration token.

### "Command not found: npx"
→ Install Node.js from https://nodejs.org/

## Next Steps

Once it's working, check out:

- **NOTION_MCP_SETUP.md** - Detailed setup and configuration
- **examples/notion-mcp-workflows.md** - Practical usage examples

## Common First Commands

```
# List all accessible pages
List my Notion pages

# Create a new page
Create a Notion page titled "Test Page" with a checklist

# Search content
Find Notion pages about "design system"

# Get page content
Show me the content of the page titled "Meeting Notes"
```

## Security Reminder

Never commit `.env.local` to git! Your token is secret.
The `.gitignore` already protects it, but double-check before committing.

---

**Need help?** See NOTION_MCP_SETUP.md for detailed troubleshooting.
