import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';

// GET - Fetch messages by chatId
export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
    }

    // Verify user has access to this chat
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { ownerId: true, caregiverId: true },
    });

    if (!chat || (chat.ownerId !== userId && chat.caregiverId !== userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch messages for this chat
    const messages = await prisma.message.findMany({
      where: { chatId },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST - Create a new message
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
    const { chatId, content, attachmentUrl, attachmentName, attachmentType } = await request.json();

    if (!chatId || !content) {
      return NextResponse.json(
        { error: 'chatId and content are required' },
        { status: 400 }
      );
    }

    // Verify chat exists and user is part of it
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { ownerId: true, caregiverId: true },
    });

    if (!chat || (chat.ownerId !== userId && chat.caregiverId !== userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        content,
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
        attachmentType: attachmentType || null,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update chat's lastMessage and updatedAt
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}