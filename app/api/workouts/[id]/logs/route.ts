import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST add workout log to session
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { exerciseId, weight, reps, sets, completed, notes } = body;

    if (!exerciseId || weight === undefined || !reps || !sets) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const workoutLog = await prisma.workoutLog.create({
      data: {
        sessionId: params.id,
        exerciseId,
        weight,
        reps,
        sets,
        completed: completed !== undefined ? completed : true,
        notes,
      },
      include: {
        exercise: true,
      },
    });

    return NextResponse.json(workoutLog, { status: 201 });
  } catch (error) {
    console.error('Error creating workout log:', error);
    return NextResponse.json(
      { error: 'Failed to create workout log' },
      { status: 500 }
    );
  }
}
