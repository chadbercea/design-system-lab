/**
 * Session management using iron-session
 */

import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { AuthSession } from '@/types/auth';

const sessionOptions = {
  password: process.env.AUTH_SECRET!,
  cookieName: process.env.SESSION_COOKIE_NAME || 'docker_hub_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400', 10), // 24 hours default
    path: '/',
  },
};

/**
 * Get the current session
 */
export async function getSession(): Promise<IronSession<AuthSession>> {
  const cookieStore = await cookies();
  return getIronSession<AuthSession>(cookieStore, sessionOptions);
}

/**
 * Create a new authenticated session
 */
export async function createSession(
  username: string,
  encryptedToken: string,
  tokenExpiry?: string
): Promise<void> {
  const session = await getSession();

  session.isAuthenticated = true;
  session.username = username;
  session.encryptedToken = encryptedToken;
  session.tokenExpiry = tokenExpiry;

  await session.save();
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isAuthenticated === true && !!session.username;
}

/**
 * Get the stored encrypted token from session
 */
export async function getStoredToken(): Promise<string | undefined> {
  const session = await getSession();
  return session.encryptedToken;
}

/**
 * Get the current username from session
 */
export async function getCurrentUsername(): Promise<string | undefined> {
  const session = await getSession();
  return session.username;
}
