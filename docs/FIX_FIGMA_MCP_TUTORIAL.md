# 🎈 Fix Figma MCP - ELI5 Tutorial

## The Problem

The "Enable Figma MCP" button in Conductor is **broken**. It connects to the wrong door (`/sse`) instead of the right door (`/mcp`).

## The Solution

A magic script that knocks on the right door!

---

## 📍 Where is the script?

The script lives in your Git repo:
```
/Users/chadbercea/Github/design-system-lab/.conductor/riyadh/fix-figma-mcp.sh
```

After merging the PR, it will be available to all workspaces via Git.

---

## 🎯 How to use it successfully

### Step 1: Run the script

**If you're in riyadh workspace (or any workspace that has the script):**
```bash
./fix-figma-mcp.sh
```

**If you're in a NEW workspace that doesn't have the script yet:**
```bash
# Make sure you're on the latest main branch
git checkout main
git pull

# The script is now available!
./fix-figma-mcp.sh
```

### Step 2: Restart Conductor THE RIGHT WAY

This is critical!

✅ **The RIGHT way:**
- Press `Cmd+Q` (fully quits Conductor)
- Reopen Conductor from Applications

❌ **The WRONG way (won't work):**
- Just closing the workspace window
- Restarting the terminal
- Switching workspaces

### Step 3: Forget the UI button exists

- **Never click "Enable Figma MCP"** in Conductor's UI
- The button is broken and adds the wrong config
- The script already did everything you need
- If the button shows as "OFF", that's perfectly fine!

---

## ✅ Success Checklist

**You know it worked when:**

1. ✅ After running script + restart, you see **only ONE** Figma connection in MCP Status:
   - `FIGMA-DESKT...` (with green dot)

2. ✅ You can use Figma MCP tools in your conversations

3. ✅ The UI button stays **OFF** (and that's okay!)

---

## 🔄 When to run the script again

### Run it again if:
- ❌ You accidentally clicked the UI button (oops!)
- 🆕 You start a brand new workspace
- 👥 You see **two** Figma connections instead of one

### You DON'T need to run it:
- ✅ Every time you restart Conductor (once is enough)
- ✅ In the same workspace twice (unless you clicked the button)
- ✅ After pulling new code (unless you haven't run it in this workspace yet)

---

## 📦 Using in different workspaces

### For workspaces that already exist:

```bash
# Go to that workspace
cd /Users/chadbercea/Github/design-system-lab/.conductor/[workspace-name]

# Make sure you have the latest code
git checkout main
git pull

# Run the script
./fix-figma-mcp.sh

# Restart Conductor (Cmd+Q → Reopen)
```

### For brand new workspaces:

```bash
# Create new workspace in Conductor UI first
# Then in terminal, go to that workspace

cd /Users/chadbercea/Github/design-system-lab/.conductor/[new-workspace-name]

# Pull the latest code (includes the script)
git checkout main
git pull

# Run the script
./fix-figma-mcp.sh

# Restart Conductor (Cmd+Q → Reopen)
```

---

## 🔍 What the script actually does

Behind the scenes, the script:

1. **Removes** the broken `figma-dev-mode-mcp-server` config (workspace level)
2. **Removes** the broken `figma-dev-mode-mcp-server` config (global user level)
3. **Removes** any existing `figma-desktop` config (to start fresh)
4. **Adds** the correct `figma-desktop` config pointing to `/mcp`
5. **Verifies** the connection

You see output like:
```
🔧 Fixing Figma MCP endpoint...

1. Removing incorrect figma-dev-mode-mcp-server (workspace level)...
2. Removing incorrect figma-dev-mode-mcp-server (global user level)...
3. Removing existing figma-desktop config...
4. Adding correct Figma MCP configuration...

✅ Configuration updated. Current status:
figma-desktop: http://127.0.0.1:3845/mcp (HTTP) - ✓ Connected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  CRITICAL NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. You MUST fully restart Conductor (Cmd+Q) for tools to work
2. DO NOT click 'Enable Figma MCP' button in UI - it re-adds the broken config
3. If you accidentally click it, just run this script again

The figma-desktop connection is what you want (✓ Connected)
Ignore any figma-dev-mode-mcp-server failures
```

---

## 🚨 Troubleshooting

### Problem: I see TWO Figma connections

**What happened:** You clicked the UI button after running the script

**Fix:**
```bash
./fix-figma-mcp.sh
# Cmd+Q → Restart Conductor
```

### Problem: The script isn't in my workspace

**What happened:** You're in a workspace created before the script was added to Git

**Fix:**
```bash
git checkout main
git pull
# Script should now exist
./fix-figma-mcp.sh
```

### Problem: Script says "command not found"

**What happened:** You're not in a workspace directory

**Fix:**
```bash
# Make sure you're in a workspace directory
cd /Users/chadbercea/Github/design-system-lab/.conductor/[workspace-name]
./fix-figma-mcp.sh
```

### Problem: Figma tools still don't work

**What happened:** You didn't do a full Conductor restart

**Fix:**
- Make sure you pressed `Cmd+Q` (not just closed the window)
- Wait for Conductor to fully quit
- Reopen Conductor from Applications
- Go back to your workspace

### Problem: I forgot and clicked the UI button again

**What happened:** You're human! It happens.

**Fix:**
```bash
./fix-figma-mcp.sh
# Cmd+Q → Restart Conductor
```

---

## 📝 Quick Reference Card

| Action | Command | When |
|--------|---------|------|
| Run script | `./fix-figma-mcp.sh` | First time in workspace, or after clicking UI button |
| Restart Conductor | `Cmd+Q` → Reopen | After running script |
| Check Figma status | Check MCP Status panel | Should see only `FIGMA-DESKT...` |
| Get script in new workspace | `git pull` | When script isn't present |
| Fix duplicate connections | `./fix-figma-mcp.sh` | When you see two Figma connections |

---

## 🎓 Remember

1. **Run script once per workspace** ✅
2. **Full restart with Cmd+Q** ✅
3. **Never touch the UI button** ✅
4. **Script is in Git for sharing** ✅

---

## 📞 Still stuck?

If none of this works:
1. Check that Figma Desktop is open and in Dev Mode (press `Shift+D` in Figma)
2. Verify the MCP server is enabled in Figma's Inspect panel
3. Email Conductor support: humans@conductor.build

---

**Last Updated:** October 31, 2025
**Script Location:** `/fix-figma-mcp.sh` (in workspace root)
**Related Docs:** `FIGMA_MCP_TROUBLESHOOTING_REPORT.md`, `FIGMA_MCP_SETUP.md`
