import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Manually select a specific day
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { dayIndex } = body

    const rotation = await prisma.workoutRotation.findFirst()
    if (!rotation) {
      return NextResponse.json(
        { error: 'No rotation found' },
        { status: 404 }
      )
    }

    // Update current day index
    await prisma.workoutRotation.update({
      where: { id: rotation.id },
      data: {
        currentDayIndex: dayIndex
      }
    })

    return NextResponse.json({ success: true, dayIndex })
  } catch (error) {
    console.error('Error selecting day:', error)
    return NextResponse.json(
      { error: 'Failed to select day' },
      { status: 500 }
    )
  }
}
