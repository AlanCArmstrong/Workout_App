import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET a specific day with its exercises
export async function GET(
  request: Request,
  { params }: { params: { dayId: string } }
) {
  try {
    const day = await prisma.rotationDay.findUnique({
      where: { id: params.dayId },
      include: {
        exercises: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!day) {
      return NextResponse.json(
        { error: 'Day not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(day)
  } catch (error) {
    console.error('Error fetching day:', error)
    return NextResponse.json(
      { error: 'Failed to fetch day' },
      { status: 500 }
    )
  }
}

// PATCH - Update day name
export async function PATCH(
  request: Request,
  { params }: { params: { dayId: string } }
) {
  try {
    const body = await request.json()
    const { name } = body

    const day = await prisma.rotationDay.update({
      where: { id: params.dayId },
      data: { name }
    })

    return NextResponse.json(day)
  } catch (error) {
    console.error('Error updating day:', error)
    return NextResponse.json(
      { error: 'Failed to update day' },
      { status: 500 }
    )
  }
}
