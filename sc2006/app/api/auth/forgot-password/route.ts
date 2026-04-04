import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { forgotPasswordSchema } from '@/app/lib/validation';
import { z } from 'zod';

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true, email: true, name: true }
    });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Save reset token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetTokenExpiry,
      }
    });
    
    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Send email
    await transporter.sendMail({
      from: `${process.env.FROM_NAME || 'Pawsport'} <${process.env.FROM_EMAIL || 'noreply@pawsport.com'}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">Password Reset Request</h2>
          <p>Hello ${user.name || 'User'},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });
    
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
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
    
    console.error('Forgot password error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send reset email',
        message: 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
}