import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRecommendation } from '@/lib/progression';

// GET workout recommendation for an exercise
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

    // Count workouts since last update
    const lastWorkouts = await prisma.workoutLog.findMany({
      where: { exerciseId: params.exerciseId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const workoutsSinceLastUpdate = lastWorkouts.filter(
      (log) => log.createdAt > settings.lastUpdated
    ).length;

    const recommendation = generateRecommendation(
      {
        currentWeight: settings.currentWeight,
        currentReps: settings.currentReps,
        currentSets: settings.currentSets,
        progressionType: settings.progressionType as any,
        growthRate: settings.growthRate,
        frequency: settings.frequency as any,
      },
      workoutsSinceLastUpdate || 1
    );

    return NextResponse.json({
      exercise: settings.exercise,
      settings,
      recommendation,
      workoutsSinceLastUpdate,
    });
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
}
