// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import { loginSchema, LoginInput } from '@/app/lib/validation';
import { comparePasswords, generateTokens, setAuthCookies, sanitizeUser } from '@/app/lib/utils';
import { loginRateLimiter } from '@/app/lib/rate-limit';
import { z } from 'zod';
import { AccountStatus } from '@/app/generated/prisma/client';

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'anonymous';
    
    // Parse request body
    const body = await request.json();
    console.log(body)
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    // Find user by email
    const user = await prisma.user.findFirst({
        where: {
            OR: [
            { email: validatedData.identifier },
            { name: validatedData.identifier }
            ]
        },
        select: { 
            id: true, 
            email: true,
            name: true,
            verified: true,
            password: true,
            status: true,
            role: true
        }
        });
    
    // Check if user exists
    if (!user) {
      // Use generic message to prevent email enumeration
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        },
        { status: 401 }
      );
    }
    
    // Check if email is verified
    if (!user.verified) {
      return NextResponse.json(
        { 
          error: 'Email not verified',
          message: 'Please verify your email before logging in',
          needsVerification: true,
          email: user.email
        },
        { status: 403 }
      );
    }
    
    // Verify password
    const isValidPassword = await comparePasswords(validatedData.password, user.password);
    
    if (!isValidPassword) {
      // Check rate limit
        if (!loginRateLimiter.check(ip)) {
            const remainingMs = loginRateLimiter.getResetTime(ip);
            return NextResponse.json(
                { 
                    error: 'Too many login attempts',
                    message: `Please try again in ${remainingMs} minutes`
                },
                { status: 429 }
            );
        }
      
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'Password is incorrect'
        },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (user.status === AccountStatus.SUSPENDED) {
      return NextResponse.json(
        {
          error: 'Account suspended',
          message: 'This account has been suspended. Please contact support.'
        },
        { status: 403 }
      );
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id, 
      user.email, 
      user.role,
      validatedData.rememberMe || false
    );
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
      accessToken,
    });
    
    // Set auth cookies
    setAuthCookies(response, accessToken, refreshToken, false);
    
    return response;
    
  } catch (error) {
    console.log('Login error:', error);
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { 
          error: 'Validation failed',
          field: firstError.path[0],
          message: firstError.message
        },
        { status: 400 }
      );
    }
    
    // Log unexpected errors
    console.error('Login error:', error);
    
    return NextResponse.json(
      { 
        error: 'Login failed',
        message: 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
}