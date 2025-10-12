import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET growth settings
export async function GET() {
  try {
    const rotation = await prisma.workoutRotation.findFirst({
      include: {
        growthSettings: true
      }
    })

    if (!rotation?.growthSettings) {
      return NextResponse.json(null)
    }

    return NextResponse.json(rotation.growthSettings)
  } catch (error) {
    console.error('Error fetching growth settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch growth settings' },
      { status: 500 }
    )
  }
}

// PATCH - Update growth settings
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { growthType, amount, frequency, decayRate } = body

    const rotation = await prisma.workoutRotation.findFirst()
    if (!rotation) {
      return NextResponse.json(
        { error: 'No rotation found' },
        { status: 404 }
      )
    }

    const settings = await prisma.growthSettings.upsert({
      where: { rotationId: rotation.id },
      update: {
        growthType,
        amount,
        frequency,
        ...(decayRate !== undefined && { decayRate })
      },
      create: {
        rotationId: rotation.id,
        growthType,
        amount,
        frequency,
        decayRate: decayRate ?? 0.01
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating growth settings:', error)
    return NextResponse.json(
      { error: 'Failed to update growth settings' },
      { status: 500 }
    )
  }
}
