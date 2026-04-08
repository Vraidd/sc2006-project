import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';
import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const chatReportSchema = z.object({
  chatId: z.string().min(1),
  description: z.string().trim().min(10),
});

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

function isAllowedAttachmentType(mimeType: string) {
  return mimeType.startsWith('image/') || mimeType.startsWith('video/');
}

function normalizeExtension(filename: string, mimeType: string) {
  const fromName = path.extname(filename).toLowerCase();
  if (/^\.[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  if (mimeType.startsWith('image/')) return '.jpg';
  if (mimeType.startsWith('video/')) return '.mp4';
  return '';
}

export async function POST(request: NextRequest) {
  let savedAttachmentAbsolutePath: string | null = null;

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

    const contentType = request.headers.get('content-type') ?? '';

    let chatId = '';
    let description = '';
    let attachmentUrl: string | null = null;
    let attachmentType: string | null = null;
    let attachmentName: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      chatId = String(formData.get('chatId') ?? '').trim();
      description = String(formData.get('description') ?? '').trim();

      const attachment = formData.get('attachment');
      if (attachment instanceof File && attachment.size > 0) {
        const mimeType = attachment.type || '';

        if (!isAllowedAttachmentType(mimeType)) {
          return NextResponse.json(
            { error: 'Attachment must be an image or video file' },
            { status: 400 }
          );
        }

        const maxBytes = mimeType.startsWith('video/') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
        if (attachment.size > maxBytes) {
          return NextResponse.json(
            { error: mimeType.startsWith('video/') ? 'Video must be 25MB or smaller' : 'Image must be 10MB or smaller' },
            { status: 400 }
          );
        }

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'incidents');
        await mkdir(uploadsDir, { recursive: true });

        const extension = normalizeExtension(attachment.name, mimeType);
        const storedName = `${Date.now()}-${randomUUID()}${extension}`;
        const absoluteFilePath = path.join(uploadsDir, storedName);
        const bytes = Buffer.from(await attachment.arrayBuffer());
        await writeFile(absoluteFilePath, bytes);

        savedAttachmentAbsolutePath = absoluteFilePath;
        attachmentUrl = `/uploads/incidents/${storedName}`;
        attachmentType = mimeType;
        attachmentName = attachment.name;
      }
    } else {
      const parsed = chatReportSchema.safeParse(await request.json());

      if (!parsed.success) {
        return NextResponse.json({ error: 'chatId and valid description are required' }, { status: 400 });
      }

      chatId = parsed.data.chatId;
      description = parsed.data.description;
    }

    const parsed = chatReportSchema.safeParse({ chatId, description });

    if (!parsed.success) {
      return NextResponse.json({ error: 'chatId and valid description are required' }, { status: 400 });
    }

    ({ chatId, description } = parsed.data);

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        id: true,
        ownerId: true,
        caregiverId: true,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    if (userId !== chat.ownerId && userId !== chat.caregiverId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (userId !== chat.ownerId) {
      return NextResponse.json(
        { error: 'Only owners can submit user reports from chat at the moment' },
        { status: 403 }
      );
    }

    const latestBooking = await prisma.booking.findFirst({
      where: {
        ownerId: chat.ownerId,
        caregiverId: chat.caregiverId,
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    if (!latestBooking) {
      return NextResponse.json(
        { error: 'No booking found for this chat. Unable to create report.' },
        { status: 400 }
      );
    }

    const incident = await prisma.incident.create({
      data: {
        bookingId: latestBooking.id,
        reporterId: chat.ownerId,
        caregiverId: chat.caregiverId,
        type: 'OTHER',
        description: `Chat report: ${description}`,
        attachmentUrl,
        attachmentType,
        attachmentName,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, incident }, { status: 201 });
  } catch (error) {
    if (savedAttachmentAbsolutePath) {
      await unlink(savedAttachmentAbsolutePath).catch(() => undefined);
    }
    console.error('Create chat report error:', error);
    return NextResponse.json({ error: 'Failed to submit chat report' }, { status: 500 });
  }
}
