// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/app/lib/utils';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
  
  return clearAuthCookies(response);
}