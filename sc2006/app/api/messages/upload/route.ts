import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';

// Allowed file types for message attachments
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-zip-compressed',
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
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

    const userId = payload.userId;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const chatId = formData.get('chatId') as string;
    const content = formData.get('content') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not supported' }, { status: 400 });
    }

    // Verify user has access to this chat
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { ownerId: true, caregiverId: true },
    });

    if (!chat || (chat.ownerId !== userId && chat.caregiverId !== userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const extension = originalName.split('.').pop() || 'bin';
    const filename = `msg-${uuidv4()}.${extension}`;

    // Define upload path
    const uploadDir = path.join(process.cwd(), 'public/uploads/messages');
    const filePath = path.join(uploadDir, filename);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Save file
    await writeFile(filePath, buffer);

    // Public URL
    const fileUrl = `/uploads/messages/${filename}`;

    // Create message with attachment
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        content: content || `Sent a file: ${originalName}`,
        attachmentUrl: fileUrl,
        attachmentName: originalName,
        attachmentType: file.type,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update chat's lastMessage
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: content || `Sent a file: ${originalName}`,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message }, { status: 201 });

  } catch (error) {
    console.error('Message file upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}