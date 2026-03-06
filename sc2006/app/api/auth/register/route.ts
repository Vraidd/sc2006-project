import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, role } = body;
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'PET_OWNER' // Default to pet owner
            }
        });
        
        // Create session/token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
        
        return NextResponse.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}