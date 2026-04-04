// app/api/pets/[petId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/utils';
import { petUpdateSchema } from '@/app/lib/validation';
import { z } from 'zod';

// GET - Fetch single pet
export async function GET(request: NextRequest, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token, process.env.JWT_SECRET!);
    if (!payload || typeof payload === 'string') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch pet with bookings
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        ownerId: payload.userId, // Ensure user owns this pet
      },
      include: {
        bookings: {
          include: {
            caregiver: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          },
          orderBy: {
            startDate: 'desc'
          }
        }
      }
    });

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    const formattedPet = {
      ...pet,
      bookings: pet.bookings.map(b => ({
        id: b.id,
        ownerId: b.ownerId,
        caregiverId: b.caregiverId,
        petId: b.petId,
        startDate: b.startDate,
        endDate: b.endDate,
        status: b.status,
        totalPrice: b.totalPrice,
        specialInstructions: b.specialInstructions,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        caregiver: b.caregiver,
      })),
    };

    return NextResponse.json({ pet: formattedPet });

  } catch (error) {
    console.error('Fetch pet error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pet' },
      { status: 500 }
    );
  }
}

// PUT - Update pet
export async function PUT(request: NextRequest, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token, process.env.JWT_SECRET!);
    if (!payload || typeof payload === 'string') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if pet exists and belongs to user
    const existingPet = await prisma.pet.findFirst({
      where: {
        id: petId,
        ownerId: payload.userId,
      }
    });

    if (!existingPet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = petUpdateSchema.parse(body);

    // Update pet
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      message: 'Pet updated successfully',
      pet: updatedPet
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { 
          error: 'Validation failed',
          field: firstError.path[0],
          message: firstError.message
        },
        { status: 400 }
      );
    }

    console.error('Update pet error:', error);
    return NextResponse.json(
      { error: 'Failed to update pet' },
      { status: 500 }
    );
  }
}

// DELETE - Remove pet
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token, process.env.JWT_SECRET!);
    if (!payload || typeof payload === 'string') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if pet exists and belongs to user
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        ownerId: payload.userId,
      },
      include: {
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
            }
          }
        }
      }
    });

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    // Check if pet has active bookings
    if (pet.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete pet with active bookings' },
        { status: 400 }
      );
    }

    // Delete pet
    await prisma.pet.delete({
      where: { id: petId },
    });

    return NextResponse.json({
      success: true,
      message: 'Pet deleted successfully'
    });

  } catch (error) {
    console.error('Delete pet error:', error);
    return NextResponse.json(
      { error: 'Failed to delete pet' },
      { status: 500 }
    );
  }
}
