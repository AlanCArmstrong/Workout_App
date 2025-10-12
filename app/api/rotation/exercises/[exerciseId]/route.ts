import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Update an exercise
export async function PATCH(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const body = await request.json()
    const { name, weight, reps, sets } = body

    const exercise = await prisma.dayExercise.update({
      where: { id: params.exerciseId },
      data: {
        ...(name && { name }),
        ...(weight !== undefined && { weight: parseFloat(weight) }),
        ...(reps !== undefined && { reps: parseInt(reps) }),
        ...(sets !== undefined && { sets: parseInt(sets) })
      }
    })

    return NextResponse.json(exercise)
  } catch (error) {
    console.error('Error updating exercise:', error)
    return NextResponse.json(
      { error: 'Failed to update exercise' },
      { status: 500 }
    )
  }
}

// DELETE - Remove an exercise
export async function DELETE(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    await prisma.dayExercise.delete({
      where: { id: params.exerciseId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting exercise:', error)
    return NextResponse.json(
      { error: 'Failed to delete exercise' },
      { status: 500 }
    )
  }
}
