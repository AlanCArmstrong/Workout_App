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
