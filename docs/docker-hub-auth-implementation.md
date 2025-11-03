# Docker Hub Authentication Implementation Plan

## Overview

This document outlines the implementation plan for Docker Hub authentication in the Next.js application.

## Research Findings

**Key Discovery:** Docker Hub does NOT offer traditional OAuth2 flow for third-party web applications. Docker Hub provides:

1. **Personal Access Tokens (PATs)** - Recommended for programmatic access
2. **Username/Password** - Traditional authentication
3. **OAuth2 Token Protocol** - Only for Docker Registry interactions, not for user login

## Recommended Approach

Given Docker Hub's authentication options, we'll implement a **hybrid authentication system**:

### Authentication Flow

```
User Input → Verify Credentials → Obtain Token → Store Securely → Use for API Calls
```

1. **Username + Personal Access Token** (Primary Method)
   - User creates PAT in Docker Hub
   - User enters username + PAT in our app
   - We validate and store securely
   - Most secure option

2. **Username + Password** (Alternative Method)
   - User enters Docker Hub credentials
   - We exchange for JWT token via Docker Hub API
   - Store token securely
   - Fallback for users without PATs

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  - First Launch Auth Modal                                  │
│  - Settings Page (Auth Status, Sign Out)                    │
│  - Auth Context Provider                                    │
│  - Protected Routes                                         │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   API Routes (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  - POST /api/auth/login                                     │
│  - POST /api/auth/logout                                    │
│  - GET  /api/auth/status                                    │
│  - POST /api/auth/validate                                  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Token Storage Layer                       │
├─────────────────────────────────────────────────────────────┤
│  - Server-side encrypted storage                            │
│  - HTTP-only secure cookies (for session)                   │
│  - Database or secure file storage                          │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  Docker Hub API                             │
├─────────────────────────────────────────────────────────────┤
│  - auth.docker.io (Token endpoint)                          │
│  - hub.docker.com (Registry API)                            │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Environment Configuration

```bash
# .env.local
DOCKER_HUB_AUTH_URL=https://auth.docker.io/token
DOCKER_HUB_REGISTRY_URL=https://registry-1.docker.io/v2
DOCKER_HUB_API_URL=https://hub.docker.com/v2
AUTH_SECRET=<generated-secret-for-encryption>
```

### 2. API Routes

#### `/api/auth/login`
```typescript
POST /api/auth/login
{
  "username": "string",
  "token": "string" // PAT or password
}

Response:
{
  "success": true,
  "user": {
    "username": "string",
    "verified": true
  }
}
```

#### `/api/auth/status`
```typescript
GET /api/auth/status

Response:
{
  "authenticated": true,
  "username": "string",
  "tokenExpiry": "2025-12-31T23:59:59Z"
}
```

#### `/api/auth/logout`
```typescript
POST /api/auth/logout

Response:
{
  "success": true
}
```

### 3. Docker Hub API Integration

#### Token Verification
```typescript
// Verify PAT by making test API call
const verifyDockerHubCredentials = async (username: string, token: string) => {
  const response = await fetch(`https://hub.docker.com/v2/users/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.ok;
};
```

#### Get Docker Registry Token
```typescript
// Exchange credentials for registry token
const getRegistryToken = async (username: string, password: string) => {
  const response = await fetch(
    'https://auth.docker.io/token?service=registry.docker.io&scope=repository:library/alpine:pull',
    {
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    }
  );
  const data = await response.json();
  return data.token;
};
```

### 4. Secure Token Storage

Since this is a Next.js web app (not Electron), we'll use:

1. **HTTP-only Secure Cookies** - For session management
2. **Server-side encrypted storage** - For Docker Hub tokens
3. **Database (optional)** - For multi-user scenarios

```typescript
// Server-side token encryption
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = process.env.AUTH_SECRET; // Must be 32 bytes
const ALGORITHM = 'aes-256-cbc';

export const encryptToken = (token: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decryptToken = (encryptedToken: string): string => {
  const [ivHex, encrypted] = encryptedToken.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
```

### 5. Frontend Components

#### First Launch Auth Modal
```typescript
// src/components/auth/FirstLaunchAuth.tsx
- Shows on first app load (check localStorage flag)
- Two options: "Sign in with Docker Hub" or "Skip (use template)"
- Form: username + PAT input
- Validation and error display
- Success → set auth state + close modal
```

#### Settings Page
```typescript
// src/app/settings/page.tsx
- Shows current auth status
- Display: "Signed in as: username"
- "Sign Out" button
- Re-authenticate button
- Link to Docker Hub PAT creation
```

#### Auth Context Provider
```typescript
// src/contexts/AuthContext.tsx
- Manages global auth state
- Provides: { isAuthenticated, username, login, logout, checkStatus }
- Wraps app in layout.tsx
```

### 6. User Flow

#### First Launch Flow
```
1. User opens app for first time
2. FirstLaunchAuth modal appears
3. User has two options:
   a. "Sign in with Docker Hub"
      - Link to create PAT: https://hub.docker.com/settings/security
      - Input: Username + PAT
      - Click "Sign In"
      - Validate credentials
      - Store token securely
      - Close modal
   b. "Skip for now"
      - Close modal
      - App works with template/public images only
      - Can auth later in Settings
```

#### Settings Flow
```
1. User navigates to Settings
2. If authenticated:
   - Shows: "Signed in as: username"
   - Button: "Sign Out"
3. If not authenticated:
   - Shows: "Not signed in"
   - Button: "Sign in with Docker Hub"
4. Sign out:
   - Clear stored token
   - Clear cookies
   - Update auth context
   - Show success message
```

## Technical Implementation Stack

### Dependencies
```json
{
  "dependencies": {
    "jose": "^5.0.0",           // JWT handling
    "iron-session": "^8.0.0"     // Secure session management
  }
}
```

### File Structure
```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       ├── status/route.ts
│   │       └── validate/route.ts
│   └── settings/
│       └── page.tsx
├── components/
│   └── auth/
│       ├── FirstLaunchAuth.tsx
│       ├── AuthStatus.tsx
│       └── SignOutButton.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── docker-hub-api.ts
│   ├── token-encryption.ts
│   └── auth-utils.ts
└── types/
    └── auth.ts
```

## Security Considerations

1. **Never store tokens in localStorage** - Use HTTP-only cookies
2. **Encrypt tokens at rest** - Use AES-256-CBC encryption
3. **HTTPS only** - Enforce secure connections
4. **Token rotation** - Handle token expiry and refresh
5. **Rate limiting** - Prevent brute force attacks
6. **Input validation** - Sanitize all user inputs
7. **CSP headers** - Content Security Policy

## Acceptance Criteria Mapping

- [x] First launch shows auth prompt → FirstLaunchAuth modal
- [x] "Skip" option available → Skip button in modal
- [x] OAuth flow opens browser → ❌ Not possible, using PAT flow instead
- [x] Callback handler receives token → ✓ API validates and stores token
- [x] Token stored securely → Server-side encrypted storage
- [x] Settings shows auth status → Settings page implementation
- [x] Sign out button clears token → Logout API route
- [x] Auth failure shows clear error message → Error handling in components

## Docker Hub API Endpoints

### Authentication
```bash
# Get token for registry operations
POST https://auth.docker.io/token
Authorization: Basic base64(username:password)
?service=registry.docker.io
&scope=repository:namespace/repo:pull,push
```

### User Info
```bash
# Validate credentials and get user info
GET https://hub.docker.com/v2/users/{username}
Authorization: Bearer <token>
```

### Repository Access
```bash
# Pull image with authentication
GET https://registry-1.docker.io/v2/{namespace}/{repo}/manifests/{tag}
Authorization: Bearer <token>
```

## Testing Strategy

1. **Unit Tests**
   - Token encryption/decryption
   - API route handlers
   - Docker Hub API client

2. **Integration Tests**
   - Full authentication flow
   - Token storage and retrieval
   - Error scenarios

3. **E2E Tests**
   - First launch flow
   - Settings authentication
   - Sign out flow

## Migration Path

Since this is a new feature:
1. No existing users to migrate
2. All users will see first launch modal on next app load
3. Store "auth_prompt_shown" flag to prevent re-prompting

## Future Enhancements

1. **Multi-registry support** - GitHub Container Registry, Google Container Registry
2. **Team accounts** - Organization token management
3. **Token refresh** - Automatic token renewal
4. **2FA support** - Two-factor authentication
5. **SSO integration** - Enterprise single sign-on

## References

- [Docker Hub Personal Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [Docker Registry HTTP API V2](https://docs.docker.com/registry/spec/api/)
- [Docker Registry Token Authentication](https://docs.docker.com/registry/spec/auth/token/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
