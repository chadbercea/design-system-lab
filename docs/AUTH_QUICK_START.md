# Quick Start Guide - Docker Hub Authentication

## For Developers

### 1. Setup (< 2 minutes)

```bash
# 1. Navigate to project directory
cd /Users/chadbercea/Github/design-system-lab/.conductor/riyadh-v2

# 2. Environment is already configured with .env.local
# No additional setup needed!

# 3. Start development server
npm run dev
```

### 2. Test Authentication Flow

```bash
# Open browser
open http://localhost:3000
```

**What you'll see:**
1. First launch modal prompts for Docker Hub authentication
2. Two options: "Sign in" or "Skip for now"
3. Enter username + Personal Access Token (or password)
4. Upon success, modal closes and you're authenticated

### 3. Create a Test Personal Access Token

1. Visit https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Name: "Development Test"
4. Permissions: Read & Write
5. Copy token (starts with `dckr_pat_`)
6. Use in the app

### 4. Test in Settings

```bash
# Navigate to settings
open http://localhost:3000/settings
```

**Test scenarios:**
- Sign in (if not authenticated)
- View authentication status
- Sign out
- Re-authenticate

## For Users

### Creating a Docker Hub Account

1. Visit https://hub.docker.com/signup
2. Create free account
3. Verify email
4. Sign in

### Getting a Personal Access Token

1. Sign in to Docker Hub
2. Go to Account Settings → Security
3. Click "New Access Token"
4. Give it a name (e.g., "My App")
5. Select permissions:
   - **Read**: View images
   - **Write**: Push images (optional)
   - **Delete**: Delete images (optional)
6. Click "Generate"
7. **IMPORTANT**: Copy the token immediately (you won't see it again!)

### First Launch

1. Open the app
2. You'll see "Connect to Docker Hub" modal
3. Two options:
   - **Sign in**: Enter username + token for full access
   - **Skip for now**: Use public images only
4. Click "Sign in" and enter:
   - Username: Your Docker Hub username
   - Token: Paste your Personal Access Token
5. Click "Sign in"

### Using Settings

Navigate to Settings (top right):
- **If authenticated**: See "Signed in as: username" with Sign Out button
- **If not authenticated**: See "Not signed in" with Sign in button

## API Examples

### Check Authentication Status

```bash
curl http://localhost:3000/api/auth/status
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your-username",
    "token": "dckr_pat_your_token"
  }'
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

## React Component Example

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, username, login, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {username}!</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    );
  }

  return (
    <button onClick={() => {
      login({ username: 'test', token: 'dckr_pat_...' });
    }}>
      Sign In
    </button>
  );
}
```

## Troubleshooting

### Modal doesn't appear on first launch

**Solution**: Clear localStorage and refresh

```javascript
// In browser console:
localStorage.removeItem('auth_prompt_shown');
location.reload();
```

### "Invalid credentials" error

**Checklist**:
- [ ] Username is correct (no typos)
- [ ] Token hasn't expired
- [ ] Token has correct permissions
- [ ] Internet connection is active
- [ ] Docker Hub is accessible

### Session not persisting

**Checklist**:
- [ ] Cookies are enabled in browser
- [ ] Using same domain/port
- [ ] No browser extensions blocking cookies
- [ ] .env.local has AUTH_SECRET set

### Build errors

```bash
# Clean and rebuild
rm -rf .next
npm run build
```

## File Locations

| What | Where |
|------|-------|
| First launch modal | `src/components/auth/FirstLaunchAuth.tsx` |
| Settings page | `src/app/settings/page.tsx` |
| Auth context | `src/contexts/AuthContext.tsx` |
| API routes | `src/app/api/auth/` |
| Config | `.env.local` |
| Docs | `docs/AUTHENTICATION.md` |

## Environment Variables

Already configured in `.env.local`:

```bash
# Docker Hub endpoints
DOCKER_HUB_AUTH_URL=https://auth.docker.io/token
DOCKER_HUB_REGISTRY_URL=https://registry-1.docker.io/v2
DOCKER_HUB_API_URL=https://hub.docker.com/v2

# Security (already generated)
AUTH_SECRET=RKJJ/VkpdWQWqvLPlmW0RmfMJcmVIyR1rniR7FHsA1s=

# Session config
SESSION_COOKIE_NAME=docker_hub_session
SESSION_MAX_AGE=86400

# Debug (off by default)
DEBUG_AUTH=false
```

## Security Notes

- ✅ Tokens encrypted with AES-256-CBC
- ✅ HTTP-only secure cookies
- ✅ Session expires after 24 hours
- ✅ No tokens in localStorage
- ⚠️ Use Personal Access Tokens, not passwords
- ⚠️ Never commit .env.local to git
- ⚠️ Generate new AUTH_SECRET for production

## Next Steps

1. ✅ Authentication implemented
2. 🔄 Test with real Docker Hub account
3. 🔄 Integrate with Docker image pulling
4. 🔄 Add Sentry error tracking
5. 🔄 User acceptance testing

## Need Help?

- **Documentation**: See `docs/AUTHENTICATION.md`
- **Implementation Details**: See `docs/docker-hub-auth-implementation.md`
- **Issue**: Linear ILI-126
