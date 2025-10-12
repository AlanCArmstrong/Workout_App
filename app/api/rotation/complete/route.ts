import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateNextProgression, shouldProgress } from '@/lib/rotation-progression'

// POST - Complete current workout and move to next day
export async function POST() {
  try {
    // Get rotation with all related data
    const rotation = await prisma.workoutRotation.findFirst({
      include: {
        days: {
          include: {
            exercises: {
              orderBy: {
                order: 'asc'
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        },
        priorityRules: true,
        growthSettings: true
      }
    })

    if (!rotation) {
      return NextResponse.json(
        { error: 'No rotation found' },
        { status: 404 }
      )
    }

    if (!rotation.priorityRules || !rotation.growthSettings) {
      return NextResponse.json(
        { error: 'Rotation missing priority rules or growth settings' },
        { status: 400 }
      )
    }

    const currentDay = rotation.days[rotation.currentDayIndex]
    const totalDays = rotation.days.length

    // Check if we should progress (based on frequency setting)
    const shouldApplyProgression = shouldProgress(
      rotation.lastWorkoutDate,
      rotation.currentDayIndex,
      totalDays,
      rotation.growthSettings.frequency as 'day' | 'rotation' | 'week'
    )

    // Apply progression to all exercises in current day if it's time
    if (shouldApplyProgression && currentDay) {
      for (const exercise of currentDay.exercises) {
        const progressed = calculateNextProgression(
          exercise,
          rotation.priorityRules,
          rotation.growthSettings
        )

        // Update exercise with new values
        await prisma.dayExercise.update({
          where: { id: exercise.id },
          data: {
            weight: progressed.weight,
            reps: progressed.reps,
            sets: progressed.sets,
            partialReps: progressed.partialReps,
            completed: false // Reset for next session
          }
        })
      }

      // If sigmoid, increment iteration count
      if (rotation.growthSettings.growthType === 'sigmoid') {
        await prisma.growthSettings.update({
          where: { id: rotation.growthSettings.id },
          data: {
            iterationCount: rotation.growthSettings.iterationCount + 1
          }
        })
      }
    } else {
      // Just reset completed flags without progression
      for (const exercise of currentDay.exercises) {
        await prisma.dayExercise.update({
          where: { id: exercise.id },
          data: { completed: false }
        })
      }
    }

    // Move to next day
    const nextDayIndex = (rotation.currentDayIndex + 1) % totalDays

    // Update rotation
    await prisma.workoutRotation.update({
      where: { id: rotation.id },
      data: {
        currentDayIndex: nextDayIndex,
        lastWorkoutDate: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      progressed: shouldApplyProgression,
      nextDayIndex
    })
  } catch (error) {
    console.error('Error completing workout:', error)
    return NextResponse.json(
      { error: 'Failed to complete workout' },
      { status: 500 }
    )
  }
}
