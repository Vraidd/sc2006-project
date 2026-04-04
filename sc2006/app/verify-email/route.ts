import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { sendWelcomeEmail } from '../lib/email'

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 })
    }

    // Find user by verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    // Check if token expired
    if (user.verificationTokenExpiry && 
        new Date() > user.verificationTokenExpiry) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    // Verify user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    })

    // If caregiver, sync verified flag to caregiver profile
    if (user.role === 'CAREGIVER') {
      await prisma.caregiverProfile.update({
        where: { id: user.id },
        data: { verified: true }
      })
    }

    // Redirect to login/dashboard
    try {
      await sendWelcomeEmail(user.email, user.name)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }
    return NextResponse.redirect(new URL('/', request.url))
    
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
