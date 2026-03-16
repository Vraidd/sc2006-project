// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ users: [] });
}

// OR for POST
export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true });
}
