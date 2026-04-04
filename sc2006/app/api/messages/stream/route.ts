import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const chatId = searchParams.get('chatId');

  if (!userId || !chatId) {
    return new Response('userId and chatId are required', { status: 400 });
  }

  // Verify authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = verifyToken(token, process.env.JWT_SECRET!);
  if (!payload || typeof payload === 'string') {
    return new Response('Invalid token', { status: 401 });
  }

  const verifiedUserId = (payload as { userId: string }).userId;

  // Verify user has access to this chat
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { ownerId: true, caregiverId: true },
  });

  if (!chat || (chat.ownerId !== verifiedUserId && chat.caregiverId !== verifiedUserId)) {
    return new Response('Access denied', { status: 403 });
  }

  // Create SSE stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

      // Get the latest message ID to start from
      let lastMessageId = '';
      const lastMessage = await prisma.message.findFirst({
        where: { chatId },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });
      
      if (lastMessage) {
        lastMessageId = lastMessage.id;
      }

      // Poll for new messages every 2 seconds
      const interval = setInterval(async () => {
        try {
          const newMessages = await prisma.message.findMany({
            where: {
              chatId,
              id: { gt: lastMessageId },
            },
            include: {
              sender: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'asc' },
          });

          for (const message of newMessages) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'message', data: message })}\n\n`)
            );
            lastMessageId = message.id;
          }
        } catch (error) {
          console.error('SSE error:', error);
        }
      }, 2000);

      // Cleanup on disconnect
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}