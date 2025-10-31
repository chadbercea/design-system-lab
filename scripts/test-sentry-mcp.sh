#!/bin/bash

# Sentry MCP Server Test Script
# This script validates the Sentry MCP server configuration

set -e

echo "🧪 Testing Sentry MCP Server Configuration"
echo "=========================================="
echo ""

# Load environment variables
if [ -f .env ]; then
    echo "📁 Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Error: .env file not found"
    echo "   Run: ./scripts/setup-sentry-mcp.sh first"
    exit 1
fi

# Check required variables
echo ""
echo "🔍 Checking configuration..."
echo ""

MISSING_VARS=0

if [ -z "$SENTRY_AUTH_TOKEN" ] || [ "$SENTRY_AUTH_TOKEN" = "your_sentry_user_auth_token_here" ]; then
    echo "❌ SENTRY_AUTH_TOKEN not set or using default value"
    MISSING_VARS=1
else
    echo "✅ SENTRY_AUTH_TOKEN is set"
fi

if [ -z "$SENTRY_HOST" ]; then
    echo "❌ SENTRY_HOST not set"
    MISSING_VARS=1
else
    echo "✅ SENTRY_HOST: $SENTRY_HOST"
fi

if [ -z "$SENTRY_ORG_SLUG" ] || [ "$SENTRY_ORG_SLUG" = "your_organization_slug" ]; then
    echo "❌ SENTRY_ORG_SLUG not set or using default value"
    MISSING_VARS=1
else
    echo "✅ SENTRY_ORG_SLUG: $SENTRY_ORG_SLUG"
fi

if [ -z "$SENTRY_PROJECT_SLUG" ] || [ "$SENTRY_PROJECT_SLUG" = "your_project_slug" ]; then
    echo "❌ SENTRY_PROJECT_SLUG not set or using default value"
    MISSING_VARS=1
else
    echo "✅ SENTRY_PROJECT_SLUG: $SENTRY_PROJECT_SLUG"
fi

if [ $MISSING_VARS -eq 1 ]; then
    echo ""
    echo "❌ Configuration incomplete. Please update your .env file."
    exit 1
fi

echo ""
echo "🌐 Testing Sentry API connectivity..."
echo ""

# Test API connection
API_URL="https://$SENTRY_HOST/api/0/organizations/$SENTRY_ORG_SLUG/projects/"
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" "$API_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Successfully connected to Sentry API"
    echo ""
    echo "📊 Available projects:"
    echo "$BODY" | grep -o '"slug":"[^"]*"' | cut -d'"' -f4 | sed 's/^/  - /'
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Authentication failed (401)"
    echo "   Check your SENTRY_AUTH_TOKEN"
    exit 1
elif [ "$HTTP_CODE" = "403" ]; then
    echo "❌ Access forbidden (403)"
    echo "   Your token may not have the required permissions"
    exit 1
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Organization not found (404)"
    echo "   Check your SENTRY_ORG_SLUG"
    exit 1
else
    echo "❌ Unexpected response (HTTP $HTTP_CODE)"
    echo "$BODY"
    exit 1
fi

echo ""
echo "🔧 Testing MCP server..."
echo ""

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

# Test MCP server help
echo "Running: npx @sentry/mcp-server@latest --help"
echo ""
if npx @sentry/mcp-server@latest --help &> /dev/null; then
    echo "✅ Sentry MCP server package is accessible"
else
    echo "⚠️  Could not run MCP server (this may be expected if not in an MCP client)"
fi

echo ""
echo "📋 Configuration Summary"
echo "========================"
echo ""
echo "MCP Server URL: https://mcp.sentry.dev/mcp (OAuth)"
echo "Organization: $SENTRY_ORG_SLUG"
echo "Project: $SENTRY_PROJECT_SLUG"
echo "Host: $SENTRY_HOST"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Configure your MCP client (Claude Desktop, Claude Code, etc.)"
echo "2. Add the Sentry MCP server configuration from mcp-config.json"
echo "3. Test queries like:"
echo "   'List projects in $SENTRY_ORG_SLUG'"
echo "   'Show recent issues in $SENTRY_PROJECT_SLUG'"
echo ""
echo "📖 See examples/sentry-mcp-workflows.md for more usage examples"
echo ""
echo "✨ Test complete!"
