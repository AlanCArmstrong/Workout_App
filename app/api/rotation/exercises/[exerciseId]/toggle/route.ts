import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Toggle exercise completion status
export async function PATCH(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const exercise = await prisma.dayExercise.findUnique({
      where: { id: params.exerciseId }
    })

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.dayExercise.update({
      where: { id: params.exerciseId },
      data: {
        completed: !exercise.completed
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error toggling exercise:', error)
    return NextResponse.json(
      { error: 'Failed to toggle exercise' },
      { status: 500 }
    )
  }
}
