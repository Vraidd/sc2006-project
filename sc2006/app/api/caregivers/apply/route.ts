import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';
import { PetType } from '@/app/generated/prisma/client';

const caregiverApplicationSchema = z.object({
  dailyRate: z.number().positive('Daily rate must be greater than 0'),
  biography: z.string().optional(),
  location: z.string().optional(),
  experienceYears: z.number().int().min(0).optional(),
  petPreferences: z.array(z.nativeEnum(PetType)).optional(),
  verificationDocs: z.array(z.object({ name: z.string(), content: z.string() })).optional(),
  availability: z
    .array(
      z.object({
        startDate: z.union([z.string(), z.date()]),
        endDate: z.union([z.string(), z.date()]).nullable(),
      })
    )
    .optional(),
});

const MAX_VERIFICATION_DOC_SIZE_BYTES = 5 * 1024 * 1024;

function estimateBase64SizeBytes(dataUrl: string) {
  const base64Data = dataUrl.split(',')[1] ?? '';
  const padding = (base64Data.match(/=+$/)?.[0].length ?? 0);
  return Math.floor((base64Data.length * 3) / 4) - padding;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token, process.env.JWT_SECRET!);
    if (!payload || typeof payload === 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = (payload as { userId: string }).userId;
    const body = await request.json();
    const validated = caregiverApplicationSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const availabilityWindow = validated.availability?.[0];
    const availabilityStartDate = availabilityWindow?.startDate
      ? new Date(availabilityWindow.startDate)
      : null;
    const availabilityEndDate = availabilityWindow?.endDate
      ? new Date(availabilityWindow.endDate)
      : null;

    const verificationDocs = validated.verificationDocs ?? [];

    for (const doc of verificationDocs) {
      if (!doc.content.startsWith('data:')) {
        return NextResponse.json(
          { error: `Invalid attachment format for ${doc.name}` },
          { status: 400 }
        );
      }

      const sizeBytes = estimateBase64SizeBytes(doc.content);
      if (sizeBytes > MAX_VERIFICATION_DOC_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Attachment ${doc.name} exceeds 5MB limit` },
          { status: 400 }
        );
      }
    }

    const serializedVerificationDocs = verificationDocs.length > 0 ? JSON.stringify(verificationDocs) : null;

    const caregiverProfile = await prisma.$transaction(async (tx) => {
      const profile = await tx.caregiverProfile.upsert({
        where: { id: userId },
        create: {
          id: userId,
          name: user.name,
          biography: validated.biography ?? null,
          location: validated.location ?? null,
          dailyRate: validated.dailyRate,
          experienceYears: validated.experienceYears ?? null,
          petPreferences: validated.petPreferences ?? [],
          dogSizes: [],
          services: [],
          availabilityStartDate,
          availabilityEndDate,
          verificationDoc: serializedVerificationDocs,
          verified: false,
        },
        update: {
          name: user.name,
          biography: validated.biography ?? null,
          location: validated.location ?? null,
          dailyRate: validated.dailyRate,
          experienceYears: validated.experienceYears ?? null,
          petPreferences: validated.petPreferences ?? [],
          availabilityStartDate,
          availabilityEndDate,
          verificationDoc: serializedVerificationDocs,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          ...(validated.location !== undefined && { location: validated.location || null }),
          ...(validated.biography !== undefined && { biography: validated.biography || null }),
          ...(user.role === 'OWNER' && { secondaryRole: 'CAREGIVER' }),
        },
      });

      const admins = await tx.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });

      if (admins.length > 0) {
        await tx.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: 'NEW_MESSAGE',
            title: 'New Caregiver Application',
            message: `${user.name} submitted a caregiver application for verification.`,
            data: {
              applicantId: userId,
              applicantName: user.name,
              dailyRate: validated.dailyRate,
              documentCount: verificationDocs.length,
              requestedAt: new Date().toISOString(),
            },
          })),
        });
      }

      await tx.notification.create({
        data: {
          userId,
          type: 'NEW_MESSAGE',
          title: 'Application Submitted',
          message: 'Your caregiver application has been sent to admin for verification.',
          data: {
            status: 'PENDING',
          },
        },
      });

      return profile;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted for admin verification.',
        caregiver: caregiverProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        {
          error: 'Validation failed',
          field: firstError.path[0],
          message: firstError.message,
        },
        { status: 400 }
      );
    }

    console.error('Caregiver apply error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
