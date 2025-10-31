#!/bin/bash

# Sentry MCP Server Setup Script
# This script helps configure the Sentry MCP server for the design system lab

set -e

echo "🔧 Sentry MCP Server Setup"
echo "=========================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Skipping creation."
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your Sentry credentials."
fi

# Prompt for configuration
echo ""
echo "Please provide your Sentry configuration:"
echo ""

read -p "Enter your Sentry organization slug: " SENTRY_ORG_SLUG
read -p "Enter your Sentry project slug: " SENTRY_PROJECT_SLUG
read -p "Enter your Sentry host (default: sentry.io): " SENTRY_HOST
SENTRY_HOST=${SENTRY_HOST:-sentry.io}

echo ""
echo "📋 Configuration Summary:"
echo "  Organization: $SENTRY_ORG_SLUG"
echo "  Project: $SENTRY_PROJECT_SLUG"
echo "  Host: $SENTRY_HOST"
echo ""

# Update .env file with values
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/your_organization_slug/$SENTRY_ORG_SLUG/g" .env
    sed -i '' "s/your_project_slug/$SENTRY_PROJECT_SLUG/g" .env
    sed -i '' "s/SENTRY_HOST=sentry.io/SENTRY_HOST=$SENTRY_HOST/g" .env
else
    # Linux
    sed -i "s/your_organization_slug/$SENTRY_ORG_SLUG/g" .env
    sed -i "s/your_project_slug/$SENTRY_PROJECT_SLUG/g" .env
    sed -i "s/SENTRY_HOST=sentry.io/SENTRY_HOST=$SENTRY_HOST/g" .env
fi

echo "✅ Updated .env file with configuration"
echo ""

# Instructions for auth token
echo "🔑 Next Steps:"
echo ""
echo "1. Create a Sentry User Auth Token:"
echo "   - Go to: https://$SENTRY_HOST/settings/account/api/auth-tokens/"
echo "   - Click 'Create New Token'"
echo "   - Select these scopes:"
echo "     ✓ org:read"
echo "     ✓ project:read"
echo "     ✓ project:write"
echo "     ✓ team:read"
echo "     ✓ team:write"
echo "     ✓ event:write"
echo ""
echo "2. Add the token to your .env file:"
echo "   SENTRY_AUTH_TOKEN=your_token_here"
echo ""
echo "3. Configure your MCP client:"
echo "   - For Claude Desktop, add mcp-config.json to:"
echo "     ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "   - Or use the OAuth method (recommended): https://mcp.sentry.dev/mcp"
echo ""
echo "4. Test the connection:"
echo "   npx @sentry/mcp-server@latest --access-token=\$SENTRY_AUTH_TOKEN --host=\$SENTRY_HOST"
echo ""
echo "📖 For detailed instructions, see SENTRY_MCP_SETUP.md"
echo ""
echo "✨ Setup complete!"
