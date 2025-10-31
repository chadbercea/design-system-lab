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

## Sentry MCP Integration

This project includes Sentry Model Context Protocol (MCP) server integration for AI-assisted error monitoring and debugging.

### Quick Setup

1. **Configure Sentry credentials:**
   ```bash
   ./scripts/setup-sentry-mcp.sh
   ```

2. **Test the connection:**
   ```bash
   ./scripts/test-sentry-mcp.sh
   ```

3. **Configure your MCP client:**
   - Add the configuration from `mcp-config.json` to your MCP client
   - Or use OAuth method: https://mcp.sentry.dev/mcp

### Documentation

- **[SENTRY_MCP_SETUP.md](./SENTRY_MCP_SETUP.md)** - Complete setup guide
- **[examples/sentry-mcp-workflows.md](./examples/sentry-mcp-workflows.md)** - Usage examples and workflows

### Docker Support

Use the provided Docker configuration for containerized development:

```bash
docker-compose -f docker-compose.sentry.yml up
```

For more details, see the [Sentry MCP Setup Guide](./SENTRY_MCP_SETUP.md).
