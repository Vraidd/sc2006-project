import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { hashPassword } from '@/app/lib/utils';
import { resetPasswordSchema } from '@/app/lib/validation';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = resetPasswordSchema.parse(body);
    const { token, newPassword } = validatedData;
    
    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
      select: { id: true, email: true },
    });
    
    if (!user) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired reset token',
          message: 'This reset link is invalid or has expired. Please request a new one.'
        },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully.'
    });
    
  } catch (error) {
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
    
    console.error('Reset password error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to reset password',
        message: 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
}