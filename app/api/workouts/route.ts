import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all workout sessions
export async function GET() {
  try {
    const sessions = await prisma.workoutSession.findMany({
      include: {
        workoutLogs: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout sessions' },
      { status: 500 }
    );
  }
}

// POST create new workout session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, notes, workoutLogs } = body;

    const session = await prisma.workoutSession.create({
      data: {
        date: date ? new Date(date) : new Date(),
        notes,
        workoutLogs: {
          create: workoutLogs || [],
        },
      },
      include: {
        workoutLogs: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating workout session:', error);
    return NextResponse.json(
      { error: 'Failed to create workout session' },
      { status: 500 }
    );
  }
}
