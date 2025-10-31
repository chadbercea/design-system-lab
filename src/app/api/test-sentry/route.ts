import { NextResponse } from 'next/server';

export async function GET() {
  // @ts-ignore - intentionally calling undefined function for Sentry test
  myUndefinedFunction();

  return NextResponse.json({ message: 'This should never return' });
}
