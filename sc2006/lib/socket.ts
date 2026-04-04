import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';
import { Socket } from 'net';

export type SocketServer = SocketIOServer;

interface SocketServerResponse extends NextApiResponse {
  socket: Socket & { server: { io?: SocketIOServer } };
}

export const initSocket = (res: SocketServerResponse) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO...');

    const httpServer: NetServer = res.socket.server as unknown as NetServer;
    
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle user authentication on socket connection
      socket.on('authenticate', async (token: string) => {
        try {
          const payload = verifyToken(token, process.env.JWT_SECRET!);
          if (payload && typeof payload !== 'string') {
            const userId = (payload as { userId: string }).userId;
            socket.data.userId = userId;
            
            // Join personal room
            socket.join(`user:${userId}`);
            console.log(`User ${userId} authenticated on socket ${socket.id}`);
          }
        } catch (error) {
          console.error('Socket authentication error:', error);
        }
      });

      // Handle joining a conversation room
      socket.on('join_conversation', (bookingId: string) => {
        if (socket.data.userId) {
          socket.join(`booking:${bookingId}`);
          console.log(`User ${socket.data.userId} joined booking room: ${bookingId}`);
        }
      });

      // Handle leaving a conversation room
      socket.on('leave_conversation', (bookingId: string) => {
        socket.leave(`booking:${bookingId}`);
      });

      // Handle sending a message
      socket.on('send_message', async (data: { chatId: string; content: string }) => {
        if (!socket.data.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        try {
          const { chatId, content } = data;

          // Verify chat exists and user is part of it
          const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { ownerId: true, caregiverId: true },
          });

          if (!chat || (chat.ownerId !== socket.data.userId && chat.caregiverId !== socket.data.userId)) {
            socket.emit('error', { message: 'Access denied' });
            return;
          }

          // Create message in database
          const message = await prisma.message.create({
            data: {
              chatId,
              senderId: socket.data.userId,
              content,
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

          // Broadcast to all users in the chat room
          io.to(`chat:${chatId}`).emit('new_message', message);

          console.log(`Message sent in chat ${chatId} by ${socket.data.userId}`);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return res.socket.server.io;
};
