import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // @ts-ignore - intentionally calling undefined function for Sentry test
    myUndefinedFunction();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }

  return NextResponse.json({ message: 'This should never return' });
}
