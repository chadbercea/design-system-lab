# Sentry MCP Server Setup Guide

This guide walks through setting up the Sentry Model Context Protocol (MCP) server for the design system lab project.

## Overview

The Sentry MCP server enables AI assistants and development tools to:
- Query error logs and stack traces
- Analyze performance metrics for components
- Track issue frequency and severity trends
- Correlate errors with specific component implementations
- Get AI-assisted fix recommendations via Sentry's Seer agent

## Prerequisites

- A Sentry account and organization
- Node.js v14 or higher
- Access to create Sentry auth tokens
- MCP-compatible client (Claude Desktop, Claude Code, etc.)

## Setup Options

### Option 1: OAuth Configuration (Recommended)

This is the simplest method and uses Sentry's hosted MCP server.

1. **Add to your MCP client configuration:**

For Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "sentry": {
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

For Claude Code, add the configuration from `mcp-config.json` to your Conductor settings.

2. **Authenticate:**
   - When you first use the Sentry MCP server, you'll be prompted to authenticate
   - Login via your Sentry organization
   - Grant the necessary permissions

### Option 2: Remote MCP with npx (Legacy)

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.sentry.dev/mcp"]
    }
  }
}
```

### Option 3: Local STDIO Mode

Use this option for more control or to run the server locally.

1. **Create a Sentry User Auth Token:**
   - Go to Settings → Account → API → Auth Tokens
   - Create a new token with these scopes:
     - `org:read`
     - `project:read`
     - `project:write`
     - `team:read`
     - `team:write`
     - `event:write`

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your token
   ```

3. **Add to MCP client configuration:**
   ```json
   {
     "mcpServers": {
       "sentry": {
         "command": "npx",
         "args": ["@sentry/mcp-server@latest", "--access-token=${SENTRY_AUTH_TOKEN}", "--host=${SENTRY_HOST}"]
       }
     }
   }
   ```

## Available MCP Tools

Once configured, the following tools are available:

### Project Management
- `list_projects` - Lists Sentry projects for an organization
- `create_project` - Creates a new Sentry project

### Issue Management
- `list_project_issues` - Lists issues in a project
- `get_sentry_issue` - Retrieves and analyzes a Sentry issue
- `resolve_short_id` - Retrieves issue details by short ID

### Event Management
- `list_error_events_in_project` - Lists error events in a project
- `list_issue_events` - Lists events for a specific issue
- `get_sentry_event` - Retrieves a specific event from an issue

### Monitoring
- `list_organization_replays` - Lists session replays

## Usage Examples

### Example 1: List Recent Issues

```
"List the most recent 10 issues from the design-system project"
```

The MCP server will call `list_project_issues` with appropriate parameters.

### Example 2: Analyze a Specific Error

```
"Get details about issue DESIGN-123 and suggest a fix"
```

The MCP server will:
1. Call `get_sentry_issue` to retrieve full context
2. Analyze the stack trace
3. Provide fix recommendations using Seer AI

### Example 3: Monitor Component Performance

```
"Show me all errors related to the Button component in the last 24 hours"
```

The server will filter events and provide performance insights.

## Docker Integration

To use the Sentry MCP server from within Docker containers:

1. **Add environment variables to your Dockerfile:**
   ```dockerfile
   ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
   ENV SENTRY_HOST=${SENTRY_HOST}
   ```

2. **Or mount credentials at runtime:**
   ```bash
   docker run -e SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN your-image
   ```

## Runtime Error Tracking

To track runtime errors in your Next.js application:

1. **Install Sentry SDK:**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry:**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Set DSN in environment:**
   Add `NEXT_PUBLIC_SENTRY_DSN` to your `.env` file (see `.env.example`)

## Troubleshooting

### Authentication Issues
- Verify your auth token has the correct scopes
- Check that the token hasn't expired
- Ensure the Sentry host URL is correct (usually `sentry.io`)

### Rate Limiting
- Sentry API has rate limits; be mindful of query frequency
- Consider caching frequent queries

### Connection Issues
- Verify network access to `mcp.sentry.dev`
- Check firewall rules if running in restricted environments
- Try the OAuth method if STDIO mode fails

## Best Practices

1. **Security:**
   - Never commit `.env` files with real tokens
   - Use different tokens for development and production
   - Rotate tokens regularly

2. **Performance:**
   - Use specific queries rather than broad searches
   - Implement pagination for large result sets
   - Cache frequently accessed data

3. **Error Grouping:**
   - Configure source maps for accurate stack traces
   - Use appropriate error boundaries in React components
   - Tag errors with component names for easier filtering

4. **Monitoring:**
   - Set up alerts for critical errors
   - Monitor MCP server usage and performance
   - Review error trends weekly

## Additional Resources

- [Sentry MCP Documentation](https://docs.sentry.io/product/sentry-mcp/)
- [Sentry MCP Server GitHub](https://github.com/getsentry/sentry-mcp-stdio)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Sentry API Documentation](https://docs.sentry.io/api/)

## Next Steps

1. ✅ Sentry MCP server configuration created
2. ⬜ Create Sentry auth token with appropriate permissions
3. ⬜ Configure MCP client (Claude Desktop/Code)
4. ⬜ Test connection and basic queries
5. ⬜ Install Sentry SDK for runtime error tracking
6. ⬜ Configure source maps for production builds
7. ⬜ Set up error boundaries in design system components
8. ⬜ Create example workflows for common debugging scenarios
