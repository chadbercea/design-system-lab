This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## MCP Integrations

This project includes Model Context Protocol (MCP) server integrations for AI-assisted development workflows.

### Available MCP Servers

#### 🔴 Sentry MCP - Error Monitoring & Debugging

AI-assisted error monitoring and debugging with Sentry.

**Quick Setup:**
1. Configure Sentry credentials: `./scripts/setup-sentry-mcp.sh`
2. Test the connection: `./scripts/test-sentry-mcp.sh`
3. Or use OAuth: https://mcp.sentry.dev/mcp

**Documentation:**
- [SENTRY_MCP_SETUP.md](./SENTRY_MCP_SETUP.md) - Complete setup guide
- [examples/sentry-mcp-workflows.md](./examples/sentry-mcp-workflows.md) - Usage examples

#### 📝 Notion MCP - Documentation & Knowledge Management

AI-assisted Notion workspace management for documentation, project tracking, and knowledge bases.

**Quick Setup:**
1. Create integration at https://www.notion.so/my-integrations
2. Add token to `.env.local`: `NOTION_API_KEY=secret_your_token`
3. Share pages with your integration
4. Restart Claude Code

**Documentation:**
- [NOTION_QUICK_START.md](./NOTION_QUICK_START.md) - 5-minute setup
- [NOTION_MCP_SETUP.md](./NOTION_MCP_SETUP.md) - Complete setup guide
- [examples/notion-mcp-workflows.md](./examples/notion-mcp-workflows.md) - Usage examples

### Docker Support

Use the provided Docker configuration for containerized development:

```bash
docker-compose -f docker-compose.sentry.yml up
```

### MCP Configuration

All MCP servers are configured in `.mcp.json`. See [MCP_CONFIG_GUIDE.md](./MCP_CONFIG_GUIDE.md) for details on how configuration works.
