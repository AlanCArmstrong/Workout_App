import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Create a new exercise in a day
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dayId, name, weight, reps, sets, partialReps, order } = body

    const exercise = await prisma.dayExercise.create({
      data: {
        dayId,
        name,
        weight: parseFloat(weight),
        reps: parseInt(reps),
        sets: parseInt(sets),
        partialReps: parseInt(partialReps) || 0,
        order: order ?? 0,
        completed: false
      }
    })

    return NextResponse.json(exercise, { status: 201 })
  } catch (error) {
    console.error('Error creating exercise:', error)
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    )
  }
}
