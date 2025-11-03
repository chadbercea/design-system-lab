/**
 * GET /api/auth/status
 * Get current authentication status
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { AuthStatusResponse } from '@/types/auth';

export async function GET() {
  try {
    const session = await getSession();

    const response: AuthStatusResponse = {
      authenticated: session.isAuthenticated === true,
      username: session.username,
      tokenExpiry: session.tokenExpiry,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Status check error:', error);

    return NextResponse.json<AuthStatusResponse>(
      {
        authenticated: false,
      },
      { status: 200 }
    );
  }
}
