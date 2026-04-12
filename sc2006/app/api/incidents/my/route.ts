import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';

const INCIDENT_TYPE_LABELS: Record<string, string> = {
  SAFETY: 'Safety Concern',
  UNRESPONSIVE: 'Caretaker Unresponsive',
  REFUND: 'Refund Request',
  OTHER: 'Other Issue',
};

export async function GET() {
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

    const userId = (payload as { userId?: string }).userId;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const incidents = await prisma.incident.findMany({
      where: { reporterId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        caregiver: {
          select: {
            name: true,
          },
        },
        booking: {
          select: {
            id: true,
            pet: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      incidents: incidents.map((incident) => ({
        id: incident.id,
        title: INCIDENT_TYPE_LABELS[incident.type] ?? 'Incident Report',
        type: incident.type,
        status: incident.status,
        description: incident.description,
        filed: incident.createdAt,
        bookingId: incident.booking.id,
        petName: incident.booking.pet.name,
        caretaker: incident.caregiver.name,
      })),
    });
  } catch (error) {
    console.error('Fetch own incidents error:', error);
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
  }
}
