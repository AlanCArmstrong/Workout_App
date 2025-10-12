import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET the current workout rotation
export async function GET() {
  try {
    // Get the first (and only) rotation
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
      return NextResponse.json(null)
    }

    return NextResponse.json(rotation)
  } catch (error) {
    console.error('Error fetching rotation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rotation' },
      { status: 500 }
    )
  }
}

// POST - Create initial rotation with defaults
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name = 'My Rotation' } = body

    // Create rotation with default priority rules and growth settings
    const rotation = await prisma.workoutRotation.create({
      data: {
        name,
        currentDayIndex: 0,
        priorityRules: {
          create: {
            repPriority: 1,
            setPriority: 2,
            weightPriority: 3,
            repMax: 15,
            repMin: 8,
            setMax: 5,
            setMin: 3,
            repsToSetsMultiplier: 2.0,
            weightRange: 10.0,
            weightIncrement: 2.5,
            overEstimateTolerance: 0.5
          }
        },
        growthSettings: {
          create: {
            growthType: 'percent',
            amount: 5.0,
            frequency: 'rotation',
            decayRate: 0.01,
            iterationCount: 0
          }
        }
      },
      include: {
        days: {
          include: {
            exercises: true
          }
        },
        priorityRules: true,
        growthSettings: true
      }
    })

    return NextResponse.json(rotation, { status: 201 })
  } catch (error) {
    console.error('Error creating rotation:', error)
    return NextResponse.json(
      { error: 'Failed to create rotation' },
      { status: 500 }
    )
  }
}
