import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, generateTokens, setAuthCookies, clearAuthCookies } from '@/app/lib/utils';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token' },
        { status: 401 }
      );
    }
    
    // Verify refresh token
    const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
    
    if (!payload || typeof payload === 'string') {
      const response = NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
      return clearAuthCookies(response);
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      payload.userId,
      payload.email,
      payload.role,
      true // maintain session length
    );
    
    const response = NextResponse.json({
      success: true,
      accessToken,
    });
    
    // Set new cookies
    setAuthCookies(response, accessToken, newRefreshToken, true);
    
    return response;
    
  } catch (error) {
    console.error('Refresh error:', error);
    const response = NextResponse.json(
      { error: 'Refresh failed' },
      { status: 500 }
    );
    return clearAuthCookies(response);
  }
}