# Docker Hub Authentication

This document describes the Docker Hub authentication implementation for the application.

## Overview

The application uses a secure, token-based authentication system for Docker Hub integration. Users can authenticate using their Docker Hub username and either a Personal Access Token (PAT) or password.

## Features

- **First Launch Prompt**: Users are prompted to authenticate on first launch (with skip option)
- **Secure Token Storage**: Credentials encrypted using AES-256-CBC and stored server-side
- **Settings Management**: Full authentication management in Settings page
- **Session Management**: HTTP-only secure cookies with iron-session
- **Error Handling**: Clear, user-friendly error messages

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  - FirstLaunchAuth Modal                                    │
│  - Settings Page                                            │
│  - AuthContext Provider                                     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   API Routes (Next.js)                      │
│  - POST /api/auth/login                                     │
│  - POST /api/auth/logout                                    │
│  - GET  /api/auth/status                                    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Session Storage                           │
│  - iron-session (HTTP-only cookies)                         │
│  - AES-256-CBC encrypted tokens                             │
└─────────────────────────────────────────────────────────────┘
```

## Setup

### 1. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Generate a secure authentication secret:

```bash
openssl rand -base64 32
```

Add the secret to `.env.local`:

```env
AUTH_SECRET=your-generated-secret-here
```

### 2. Dependencies

The required dependencies are already installed:

```json
{
  "iron-session": "^8.0.0"
}
```

## Usage

### For Users

#### First Launch

1. When you first open the app, you'll see a modal prompting for Docker Hub authentication
2. You have two options:
   - **Sign in**: Enter your Docker Hub credentials
   - **Skip**: Continue with public images only (you can authenticate later in Settings)

#### Creating a Personal Access Token

We strongly recommend using Personal Access Tokens instead of passwords:

1. Visit [Docker Hub Security Settings](https://hub.docker.com/settings/security)
2. Click "New Access Token"
3. Give it a name (e.g., "My App")
4. Set permissions (Read, Write, Delete as needed)
5. Copy the token (starts with `dckr_pat_`)
6. Use this token in the authentication form

#### Settings

Navigate to `/settings` to:
- View your authentication status
- Sign in (if not authenticated)
- Sign out (if authenticated)
- Re-authenticate if needed

### For Developers

#### Using the Auth Context

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, username, login, logout } = useAuth();

  // Check if user is authenticated
  if (isAuthenticated) {
    return <p>Signed in as: {username}</p>;
  }

  // Login
  const handleLogin = async () => {
    const result = await login({
      username: 'myusername',
      token: 'dckr_pat_...'
    });

    if (result.success) {
      console.log('Logged in!');
    } else {
      console.error(result.error);
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
}
```

#### API Endpoints

##### POST /api/auth/login

Authenticate with Docker Hub.

**Request:**
```json
{
  "username": "your-username",
  "token": "dckr_pat_... or your password"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "username": "your-username",
    "verified": true
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

##### GET /api/auth/status

Get current authentication status.

**Response:**
```json
{
  "authenticated": true,
  "username": "your-username"
}
```

##### POST /api/auth/logout

Clear session and log out.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Docker Hub API Integration

The `docker-hub-api.ts` service provides functions for interacting with Docker Hub:

```typescript
import { verifyDockerHubCredentials, getDockerRegistryToken } from '@/lib/docker-hub-api';

// Verify credentials
const { valid, userInfo, error } = await verifyDockerHubCredentials(username, token);

// Get registry token for pulling images
const { token: registryToken, error } = await getDockerRegistryToken(
  username,
  token,
  'library/alpine',
  'pull'
);
```

## Security

### Token Encryption

All Docker Hub tokens are encrypted using AES-256-CBC before storage:

```typescript
import { encryptToken, decryptToken } from '@/lib/token-encryption';

// Encrypt
const encrypted = encryptToken('dckr_pat_...');

// Decrypt
const original = decryptToken(encrypted);
```

### Session Security

Sessions use iron-session with:
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite=Lax protection
- 24-hour expiration

### Best Practices

1. **Use Personal Access Tokens**: More secure than passwords, can be revoked individually
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Rotation**: Users should periodically rotate their PATs
4. **Minimal Permissions**: Only grant necessary permissions to PATs
5. **Environment Variables**: Never commit `.env.local` to version control

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts          # Login endpoint
│   │       ├── logout/route.ts         # Logout endpoint
│   │       └── status/route.ts         # Status endpoint
│   ├── settings/
│   │   └── page.tsx                     # Settings page
│   └── layout.tsx                       # Root layout (includes AuthProvider)
├── components/
│   └── auth/
│       └── FirstLaunchAuth.tsx          # First launch modal
├── contexts/
│   └── AuthContext.tsx                  # Auth context provider
├── lib/
│   ├── docker-hub-api.ts                # Docker Hub API client
│   ├── token-encryption.ts              # Token encryption utilities
│   └── session.ts                       # Session management
└── types/
    └── auth.ts                          # TypeScript types
```

## Troubleshooting

### Error: "Invalid credentials"

- Verify your Docker Hub username is correct
- If using a PAT, ensure it hasn't expired
- If using password, check for typos
- Ensure your Docker Hub account is active

### Error: "Network error"

- Check your internet connection
- Verify Docker Hub is accessible (not blocked by firewall)
- Try again in a few moments

### Error: "Failed to encrypt token"

- Ensure `AUTH_SECRET` is set in `.env.local`
- Verify the secret is exactly 32 bytes (base64 encoded)
- Regenerate the secret if needed

### Session Not Persisting

- Check browser cookies are enabled
- Verify `SESSION_COOKIE_NAME` is set correctly
- Clear browser cookies and try again

## Testing

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Test the first launch modal:
   - Clear `localStorage` key `auth_prompt_shown`
   - Refresh page
   - Modal should appear

4. Test authentication:
   - Enter valid Docker Hub credentials
   - Verify successful login
   - Check Settings page shows authenticated state

5. Test logout:
   - Navigate to Settings
   - Click "Sign Out"
   - Verify user is logged out

### API Testing with curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your-username","token":"your-token"}'

# Check status
curl http://localhost:3000/api/auth/status

# Logout
curl -X POST http://localhost:3000/api/auth/logout
```

## Future Enhancements

1. **Multi-Registry Support**: Support for GitHub Container Registry, Google Container Registry, etc.
2. **Token Refresh**: Automatic token renewal
3. **2FA Support**: Two-factor authentication
4. **Team Accounts**: Organization token management
5. **SSO Integration**: Enterprise single sign-on
6. **Audit Logging**: Track authentication events

## References

- [Docker Hub Personal Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [Docker Registry HTTP API V2](https://docs.docker.com/registry/spec/api/)
- [Docker Registry Token Authentication](https://docs.docker.com/registry/spec/auth/token/)
- [iron-session Documentation](https://github.com/vvo/iron-session)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Support

For issues or questions:
1. Check this documentation
2. Review the implementation plan in `docs/docker-hub-auth-implementation.md`
3. Contact the development team
