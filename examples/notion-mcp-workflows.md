# Notion MCP Workflow Examples

This document contains practical examples of using Notion MCP with Claude to automate common Notion tasks.

## Table of Contents

- [Basic Operations](#basic-operations)
- [Content Management](#content-management)
- [Database Operations](#database-operations)
- [Documentation Workflows](#documentation-workflows)
- [Project Management](#project-management)
- [Advanced Use Cases](#advanced-use-cases)

## Basic Operations

### List All Accessible Pages

**Prompt:**
```
List all my Notion pages that you can access
```

**What Claude does:**
- Searches for all pages in your workspace
- Returns titles, IDs, and last edited dates

### Search for Specific Content

**Prompt:**
```
Find all Notion pages that mention "design system"
```

**What Claude does:**
- Performs a search query across your workspace
- Returns matching pages with context

### Get Page Details

**Prompt:**
```
Show me the full content of the page titled "Design System Roadmap"
```

**What Claude does:**
- Searches for the page by title
- Retrieves all blocks and content
- Formats it for easy reading

## Content Management

### Create a New Page

**Prompt:**
```
Create a new page in Notion titled "Meeting Notes - Nov 1, 2025" with these sections:
- Attendees
- Discussion Points
- Action Items
- Next Steps
```

**What Claude does:**
- Creates a new page
- Adds heading blocks for each section
- Returns the page URL

### Update Existing Content

**Prompt:**
```
Add this task to my "Action Items" section in the "Team Meeting" page:
- [ ] Review design tokens documentation
```

**What Claude does:**
- Finds the specified page
- Locates the "Action Items" section
- Appends the new to-do item

### Append Content to a Page

**Prompt:**
```
Add these notes to the bottom of my "Daily Log" page:
- Completed MCP setup
- Tested Notion integration
- Created documentation templates
```

**What Claude does:**
- Finds the page
- Appends bulleted list to the end
- Confirms the update

## Database Operations

### Create a Database

**Prompt:**
```
Create a new database called "Design System Components" with these properties:
- Name (title)
- Status (select: Not Started, In Progress, Done)
- Priority (select: Low, Medium, High)
- Owner (person)
- Last Updated (date)
```

**What Claude does:**
- Creates a new database
- Sets up all specified properties with correct types
- Returns the database URL

### Query a Database

**Prompt:**
```
Show me all items in my "Tasks" database where Status is "In Progress" and Priority is "High"
```

**What Claude does:**
- Queries the database with filters
- Returns matching entries
- Formats results in a readable table

### Add Database Entry

**Prompt:**
```
Add a new item to my "Design System Components" database:
- Name: Button Component
- Status: In Progress
- Priority: High
- Description: Implement primary and secondary button variants
```

**What Claude does:**
- Finds the database
- Creates a new page with properties
- Adds description as page content

### Update Database Properties

**Prompt:**
```
In my "Tasks" database, update the task "Review MCP setup" to Status: Done
```

**What Claude does:**
- Queries database for the task
- Updates the Status property
- Confirms the change

## Documentation Workflows

### Generate Documentation from Code

**Prompt:**
```
Read the component files in src/components and create a Notion page documenting each component with:
- Component name
- Props interface
- Usage examples
- Related components
```

**What Claude does:**
- Reads local code files
- Parses component structure
- Creates formatted Notion documentation
- Links related components

### Create Meeting Notes Template

**Prompt:**
```
Create a meeting notes template page in Notion with:
- Meeting title
- Date and time
- Attendees list
- Agenda items
- Discussion notes
- Decisions made
- Action items with owners
```

**What Claude does:**
- Creates a well-structured page
- Uses appropriate block types (headings, bullets, checkboxes)
- Can be duplicated for future meetings

### Sync Documentation

**Prompt:**
```
Compare my Notion "API Documentation" page with the actual API code in src/api and update any outdated information
```

**What Claude does:**
- Reads Notion page content
- Analyzes current API code
- Identifies discrepancies
- Updates Notion with current info

## Project Management

### Create Sprint Planning Board

**Prompt:**
```
Create a sprint planning database with:
- Sprint number
- Start/end dates
- Team members
- Goals
- Stories completed
- Velocity
```

**What Claude does:**
- Creates database with all properties
- Sets up appropriate property types
- Can populate with initial data

### Track Progress Across Pages

**Prompt:**
```
Check all pages tagged with "Q4 2025" and summarize the status of each project
```

**What Claude does:**
- Searches for tagged pages
- Reads status from each page
- Creates summary report

### Generate Status Reports

**Prompt:**
```
Create a weekly status report in Notion by:
1. Reading my "Tasks" database for completed items this week
2. Reading my "Projects" database for active projects
3. Formatting it into a status report page
```

**What Claude does:**
- Queries databases with date filters
- Aggregates information
- Creates formatted status report
- Adds metrics and highlights

## Advanced Use Cases

### Automated Task Tracking

**Prompt:**
```
Monitor my git commits today and create corresponding task completions in my Notion "Dev Log" database
```

**What Claude does:**
- Reads git commit history
- Extracts commit messages
- Creates/updates Notion entries
- Links commits to tasks

### Syncing Design Tokens

**Prompt:**
```
Read our design tokens from tokens.json and create a Notion database documenting each token with:
- Token name
- Value
- Category (color, spacing, typography)
- Usage examples
```

**What Claude does:**
- Parses token file
- Creates structured database
- Adds all tokens with properties
- Formats values appropriately

### Cross-Reference Documentation

**Prompt:**
```
Find all mentions of "useTheme" in our Notion docs and create a reference page linking to each location
```

**What Claude does:**
- Searches across workspace
- Collects all references
- Creates index page with links
- Adds context for each mention

### Backup and Export

**Prompt:**
```
Export the content of my "Design System" page and its subpages to markdown files
```

**What Claude does:**
- Retrieves page hierarchy
- Converts Notion blocks to markdown
- Creates local files with proper structure
- Preserves links and formatting

## Integration Patterns

### With Sentry (Error Documentation)

**Prompt:**
```
Get the latest errors from Sentry and create a Notion page documenting each critical issue with:
- Error message
- Stack trace
- Affected users
- Steps to reproduce
```

**What Claude does:**
- Queries Sentry MCP for errors
- Creates structured Notion pages
- Links related issues
- Tracks resolution status

### With Linear (Project Tracking)

**Prompt:**
```
Sync my Linear issues to Notion by creating a database entry for each issue with status, assignee, and description
```

**What Claude does:**
- Retrieves Linear issues
- Creates/updates Notion database
- Maintains sync between platforms
- Tracks changes

### With Git (Changelog Generation)

**Prompt:**
```
Generate a changelog in Notion from git commits since last release, organized by:
- Features
- Bug fixes
- Breaking changes
```

**What Claude does:**
- Reads git history
- Categorizes commits
- Creates formatted Notion page
- Adds version information

## Tips for Effective Use

### Be Specific with Page Names
```
❌ "Update the page"
✅ "Update the 'Design System Roadmap' page in the Engineering workspace"
```

### Provide Clear Structure
```
❌ "Make a page about components"
✅ "Create a page titled 'Component Library' with sections for Buttons, Inputs, and Layout components"
```

### Use Database Queries Efficiently
```
❌ "Show me my tasks"
✅ "Query my 'Tasks' database for items where Status is 'In Progress' and sort by Priority"
```

### Leverage Block Types
```
"Use heading 2 for section titles, bullet points for lists, and toggle blocks for detailed information"
```

## Common Patterns

### Daily Standup Notes
```
Create today's standup page with:
- What I did yesterday (from completed tasks)
- What I'm doing today (from in-progress tasks)
- Blockers (from blocked status)
```

### Component Documentation
```
For each component in src/components:
1. Create a page in the "Component Docs" database
2. Add props table
3. Add usage examples
4. Link to Storybook
```

### Release Planning
```
Create a release page:
1. Query PRs merged since last release
2. List features and fixes
3. Add migration notes if needed
4. Create distribution checklist
```

## Troubleshooting Tips

### If pages aren't accessible:
- Make sure you've shared the page with your integration (⋯ → Connections)
- Child pages inherit access, but siblings don't

### If updates aren't working:
- Verify your integration has "Update content" capability
- Check that the page isn't locked

### If searches return nothing:
- Integration only sees pages explicitly shared with it
- Use exact titles or search for page IDs

## Next Steps

1. Try basic page creation and reading
2. Set up databases for your workflow
3. Experiment with queries and filters
4. Build automation workflows
5. Integrate with other MCP servers

Happy automating with Notion MCP! 🚀
