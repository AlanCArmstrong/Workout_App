import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET priority rules
export async function GET() {
  try {
    const rotation = await prisma.workoutRotation.findFirst({
      include: {
        priorityRules: true
      }
    })

    if (!rotation?.priorityRules) {
      return NextResponse.json(null)
    }

    return NextResponse.json(rotation.priorityRules)
  } catch (error) {
    console.error('Error fetching priority rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch priority rules' },
      { status: 500 }
    )
  }
}

// PATCH - Update priority rules
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const {
      repPriority,
      setPriority,
      weightPriority,
      repMax,
      repMin,
      setMax,
      setMin,
      repsToSetsMultiplier,
      weightRange
    } = body

    const rotation = await prisma.workoutRotation.findFirst()
    if (!rotation) {
      return NextResponse.json(
        { error: 'No rotation found' },
        { status: 404 }
      )
    }

    const rules = await prisma.priorityRules.upsert({
      where: { rotationId: rotation.id },
      update: {
        repPriority,
        setPriority,
        weightPriority,
        repMax,
        repMin,
        setMax,
        setMin,
        repsToSetsMultiplier,
        weightRange
      },
      create: {
        rotationId: rotation.id,
        repPriority,
        setPriority,
        weightPriority,
        repMax,
        repMin,
        setMax,
        setMin,
        repsToSetsMultiplier,
        weightRange
      }
    })

    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error updating priority rules:', error)
    return NextResponse.json(
      { error: 'Failed to update priority rules' },
      { status: 500 }
    )
  }
}
