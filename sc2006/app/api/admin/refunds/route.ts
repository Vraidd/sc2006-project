import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';
import { z } from 'zod';

const updateRefundSchema = z.object({
  incidentId: z.string().min(1),
  action: z.enum(['approve', 'reject']),
  note: z.string().trim().max(2000).optional(),
});

function mapIncidentStatusToRefundStatus(status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED') {
  if (status === 'RESOLVED') return 'Approved';
  if (status === 'DISMISSED') return 'Rejected';
  return 'Pending';
}

function mapIncidentToRefundRequest(incident: {
  id: string;
  bookingId: string;
  description: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  createdAt: Date;
  booking: {
    owner: { name: string; email: string };
    caregiver: { name: string };
    payment: { id: string; amount: number } | null;
    totalPrice: number;
  };
}) {
  const amount = Number((incident.booking.payment?.amount ?? incident.booking.totalPrice).toFixed(2));

  return {
    id: incident.id,
    incidentId: incident.id,
    bookingId: incident.bookingId,
    owner: incident.booking.owner.email,
    ownerName: incident.booking.owner.name,
    caretaker: incident.booking.caregiver.name,
    amount,
    reason: incident.description,
    status: mapIncidentStatusToRefundStatus(incident.status),
    datetime: incident.createdAt,
    transactionId: incident.booking.payment?.id ?? null,
  };
}

async function ensureAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const payload = verifyToken(token, process.env.JWT_SECRET!);
  if (!payload || typeof payload === 'string') {
    return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) };
  }

  const userId = (payload as { userId?: string }).userId;
  if (!userId) {
    return { error: NextResponse.json({ error: 'Invalid token payload' }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 }) };
  }

  return { userId };
}

// GET - Fetch refund requests for admin review
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await ensureAdmin();
    if ('error' in adminCheck) return adminCheck.error;

    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status') ?? 'all';

    const incidents = await prisma.incident.findMany({
      where: {
        type: 'REFUND',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            totalPrice: true,
            owner: { select: { name: true, email: true } },
            caregiver: { select: { name: true } },
            payment: { select: { id: true, amount: true } },
          },
        },
      },
    });

    const requests = incidents
      .map(mapIncidentToRefundRequest)
      .filter((requestRecord) => statusFilter === 'all' || requestRecord.status === statusFilter);

    const pendingCount = requests.filter((r) => r.status === 'Pending').length;
    const approvedCount = requests.filter((r) => r.status === 'Approved').length;
    const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;
    const totalPendingAmount = requests
      .filter((r) => r.status === 'Pending')
      .reduce((sum, r) => sum + r.amount, 0);

    return NextResponse.json(
      {
        requests,
        stats: {
          pendingCount,
          approvedCount,
          rejectedCount,
          totalPendingAmount: Number(totalPendingAmount.toFixed(2)),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch admin refunds error:', error);
    return NextResponse.json({ error: 'Failed to fetch refund requests' }, { status: 500 });
  }
}

// PATCH - Approve/reject a refund request
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await ensureAdmin();
    if ('error' in adminCheck) return adminCheck.error;

    const body = await request.json();
    const validated = updateRefundSchema.parse(body);

    const incident = await prisma.incident.findUnique({
      where: { id: validated.incidentId },
      include: {
        booking: {
          select: {
            totalPrice: true,
            ownerId: true,
            owner: { select: { name: true } },
            caregiver: { select: { name: true } },
            payment: {
              select: {
                id: true,
                amount: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!incident) {
      return NextResponse.json({ error: 'Refund request not found' }, { status: 404 });
    }

    if (incident.type !== 'REFUND') {
      return NextResponse.json({ error: 'Incident is not a refund request' }, { status: 400 });
    }

    const isApprove = validated.action === 'approve';
    const now = new Date();

    if (isApprove && !incident.booking.payment) {
      return NextResponse.json({ error: 'No payment record found for this booking' }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedIncident = await tx.incident.update({
        where: { id: incident.id },
        data: {
          status: isApprove ? 'RESOLVED' : 'DISMISSED',
          resolutionNotes: validated.note || null,
          resolvedAt: now,
          resolvedById: adminCheck.userId,
        },
        include: {
          booking: {
            select: {
              totalPrice: true,
              ownerId: true,
              owner: { select: { name: true, email: true } },
              caregiver: { select: { name: true } },
              payment: {
                select: {
                  id: true,
                  amount: true,
                },
              },
            },
          },
        },
      });

      if (isApprove) {
        await tx.payment.update({
          where: { bookingId: incident.bookingId },
          data: {
            status: 'REFUNDED',
            refundedAt: now,
          },
        });

        await tx.notification.create({
          data: {
            userId: updatedIncident.booking.ownerId,
            type: 'PAYMENT_REFUNDED',
            title: 'Refund approved',
            message: `Your refund request for booking ${incident.bookingId} has been approved.`,
            data: {
              bookingId: incident.bookingId,
              incidentId: incident.id,
              amount: incident.booking.payment?.amount ?? incident.booking.totalPrice,
            },
          },
        });
      }

      return updatedIncident;
    });

    return NextResponse.json({ success: true, request: mapIncidentToRefundRequest(updated) }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }

    console.error('Update admin refund error:', error);
    return NextResponse.json({ error: 'Failed to update refund request' }, { status: 500 });
  }
}
