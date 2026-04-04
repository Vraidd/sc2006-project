import { NextResponse } from 'next/server';
import { initSocket } from '@/lib/socket';

export async function GET(request: Request, res: any) {
  const response = res as any;
  
  if (!response.socket.server.io) {
    initSocket(response);
  }

  return NextResponse.json({ socket: 'ready' });
}