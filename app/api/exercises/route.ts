import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all exercises
export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany({
      include: {
        progressionSettings: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}

// POST create new exercise
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Exercise name is required' },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        description,
        category,
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    );
  }
}
