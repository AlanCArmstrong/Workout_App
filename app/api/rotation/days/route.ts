import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Create a new day in the rotation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rotationId, dayNumber, name, order } = body

    const day = await prisma.rotationDay.create({
      data: {
        rotationId,
        dayNumber,
        name: name || `Day ${dayNumber}`,
        order: order ?? dayNumber - 1
      },
      include: {
        exercises: true
      }
    })

    return NextResponse.json(day, { status: 201 })
  } catch (error) {
    console.error('Error creating day:', error)
    return NextResponse.json(
      { error: 'Failed to create day' },
      { status: 500 }
    )
  }
}
