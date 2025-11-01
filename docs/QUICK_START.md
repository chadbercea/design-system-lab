# Sentry MCP Quick Start (OAuth Method)

## Step 1: Update Claude Desktop Config

Copy the entire contents of `claude-desktop-config-update.json` and replace your Claude Desktop config:

**Config file location:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Or run this command:**
```bash
cp claude-desktop-config-update.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

## Step 2: Restart Claude Desktop

Completely quit and restart Claude Desktop for the MCP server to load.

## Step 3: Authenticate

In your next Claude Desktop conversation, the Sentry MCP server will prompt you to authenticate via OAuth:
1. You'll get a browser link
2. Log in to your Sentry organization
3. Grant permissions
4. Return to Claude

## Step 4: Test It

Once authenticated, try these queries in Claude Desktop:

```
List my Sentry organizations
```

```
List all projects in [your-org-slug]
```

```
Show me recent issues from [project-slug]
```

## What If I Don't Have Sentry Yet?

1. Go to https://sentry.io/signup/
2. Create a free account (takes 2 minutes)
3. Create your first project
4. Come back and use the MCP server

## Currently in Conductor?

Since we're in Conductor (not Claude Desktop), you can:
1. Follow the steps above to set up Claude Desktop
2. Test the Sentry MCP there
3. Come back here to integrate Sentry SDK into the Next.js app

---

**Note:** The MCP server will be available in Claude Desktop, not in Conductor/Claude Code at this time.
