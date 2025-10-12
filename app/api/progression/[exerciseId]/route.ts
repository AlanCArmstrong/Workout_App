import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET progression settings for an exercise
export async function GET(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const settings = await prisma.progressionSettings.findUnique({
      where: { exerciseId: params.exerciseId },
      include: { exercise: true },
    });

    if (!settings) {
      return NextResponse.json(
        { error: 'Progression settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching progression settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progression settings' },
      { status: 500 }
    );
  }
}

// POST/PUT create or update progression settings
export async function POST(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const body = await request.json();
    const {
      currentWeight,
      currentReps,
      currentSets,
      progressionType,
      growthRate,
      frequency,
    } = body;

    const settings = await prisma.progressionSettings.upsert({
      where: { exerciseId: params.exerciseId },
      update: {
        currentWeight,
        currentReps,
        currentSets,
        progressionType,
        growthRate,
        frequency,
      },
      create: {
        exerciseId: params.exerciseId,
        currentWeight,
        currentReps: currentReps || 10,
        currentSets: currentSets || 3,
        progressionType: progressionType || 'linear',
        growthRate: growthRate || 5.0,
        frequency: frequency || 'per_workout',
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving progression settings:', error);
    return NextResponse.json(
      { error: 'Failed to save progression settings' },
      { status: 500 }
    );
  }
}
