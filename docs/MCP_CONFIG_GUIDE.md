# MCP Configuration Guide

## How MCP Config Works in Conductor/Claude Code

MCP server configurations are stored in **3 possible locations** (in order of precedence):

### 1. User Config (Global) - **ALREADY DONE** ✅
**Location**: `~/.claude.json`

Your Sentry authentication is **already saved here** after you ran `claude /mcp` and authenticated. This config applies to **all your projects**.

You **never have to authenticate again** - it's persisted!

### 2. Project Config (Shared via Git) - **JUST ADDED** ✅
**Location**: `.mcp.json` (this repo)

I just created this file and committed it. This means:
- Anyone who clones this repo gets the Sentry MCP config
- They still need to authenticate once with `claude /mcp`
- But the server URL is already configured

### 3. Local Project Config (Private)
**Location**: `~/.claude.json [project: /path/to/project]`

For project-specific overrides that you don't want to commit.

## What Happens on New Machine/Clone?

When you or someone else clones this repo:

1. **The `.mcp.json` tells Conductor**: "This project uses Sentry MCP"
2. **User runs `claude /mcp`** once to authenticate (OAuth happens in browser)
3. **Authentication is saved** to `~/.claude.json`
4. **Never needs to authenticate again** across any project

## Quick Reference

### Check MCP Status
```bash
claude /mcp
```

### Re-authenticate Sentry (if needed)
```bash
claude /mcp
# Select "3. sentry"
# Press Enter to login
```

### View Your Config Files
```bash
# User-level (your auth tokens)
cat ~/.claude.json

# Project-level (this repo's MCP servers)
cat .mcp.json
```

## What's Backed Up in Git?

✅ **`.mcp.json`** - Server configuration (URL, no secrets)
✅ **`SENTRY_MCP_SETUP.md`** - Setup documentation
✅ **`examples/sentry-mcp-workflows.md`** - Usage examples
✅ **`.env.example`** - Environment template
✅ **Sentry SDK configuration** - All the TypeScript files

❌ **`.env.local`** - Your actual DSN (in .gitignore)
❌ **`~/.claude.json`** - Your OAuth tokens (stays on your machine)

## TL;DR

**You're done!** Your Sentry MCP is:
- ✅ Authenticated and working
- ✅ Backed up in your user config (`~/.claude.json`)
- ✅ Shared in this repo (`.mcp.json`)
- ✅ Will work on any machine after one-time OAuth

You'll **never have to go through the authentication hoops again** unless you:
- Delete `~/.claude.json`
- Use a different computer (then just authenticate once)
- Revoke the OAuth token in Sentry

## Testing on New Machine

To verify this works on a fresh clone:

1. Clone the repo
2. Conductor sees `.mcp.json` and knows Sentry is available
3. Run `claude /mcp` and select Sentry to authenticate
4. Done! Sentry MCP works in all conversations
