/**
 * POST /api/auth/login
 * Authenticate user with Docker Hub credentials
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyDockerHubCredentials } from '@/lib/docker-hub-api';
import { encryptToken } from '@/lib/token-encryption';
import { createSession } from '@/lib/session';
import { AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, token } = body;

    // Validate input
    if (!username || !token) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: 'Username and token are required',
        },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-z0-9_-]+$/i.test(username)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: 'Invalid username format',
        },
        { status: 400 }
      );
    }

    // Log attempt (remove in production or use proper logging)
    if (process.env.DEBUG_AUTH === 'true') {
      console.log(`Login attempt for user: ${username}`);
    }

    // Verify credentials with Docker Hub
    const { valid, userInfo, error } = await verifyDockerHubCredentials(username, token);

    if (!valid || !userInfo) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: error?.message || 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    // Encrypt token for storage
    const encryptedToken = encryptToken(token);

    // Create session
    await createSession(username, encryptedToken);

    // Return success response
    return NextResponse.json<AuthResponse>(
      {
        success: true,
        user: {
          username: userInfo.username,
          verified: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
