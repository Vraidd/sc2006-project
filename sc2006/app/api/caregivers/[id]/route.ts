// app/api/caregivers/[id]/route.ts - SINGLE CAREGIVER
import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type VerificationDoc = {
  name: string;
  content?: string;
};

function parseVerificationDocs(raw: string | null): VerificationDoc[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((doc): doc is VerificationDoc => Boolean(doc && typeof doc.name === 'string'))
        .map((doc) => ({
          name: doc.name,
          content: typeof doc.content === 'string' ? doc.content : undefined,
        }));
    }
  } catch {
    // Legacy format support: comma-separated filenames.
  }

  return raw
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ name }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caregiver = await prisma.caregiverProfile.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        biography: true,
        dailyRate: true,
        location: true,
        availabilityStartDate: true,
        availabilityEndDate: true,
        experienceYears: true,
        petPreferences: true,
        verificationDoc: true,
        verified: true,
        averageRating: true,
        totalReviews: true,
        completedBookings: true,
        services: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!caregiver) {
      return NextResponse.json({ error: 'Caregiver not found' }, { status: 404 });
    }

    return NextResponse.json({
      caregiver: {
        ...caregiver,
        verificationDocs: parseVerificationDocs(caregiver.verificationDoc),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
