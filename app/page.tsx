'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatExerciseDisplay, calculateTotalLoad } from '@/lib/rotation-progression'

export const dynamic = 'force-dynamic'

interface DayExercise {
  id: string
  name: string
  weight: number
  reps: number
  sets: number
  partialReps: number
  completed: boolean
  order: number
}

interface RotationDay {
  id: string
  dayNumber: number
  name: string
  order: number
  exercises: DayExercise[]
}

interface WorkoutRotation {
  id: string
  name: string
  currentDayIndex: number
  days: RotationDay[]
}

export default function Home() {
  const [rotation, setRotation] = useState<WorkoutRotation | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDay, setCurrentDay] = useState<RotationDay | null>(null)

  useEffect(() => {
    fetchRotation()
  }, [])

  const fetchRotation = async () => {
    try {
      const response = await fetch('/api/rotation')
      if (response.ok) {
        const data = await response.json()
        setRotation(data)
        if (data?.days?.length > 0) {
          setCurrentDay(data.days[data.currentDayIndex] || data.days[0])
        }
      }
    } catch (error) {
      console.error('Error fetching rotation:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExerciseComplete = async (exerciseId: string) => {
    try {
      await fetch(`/api/rotation/exercises/${exerciseId}/toggle`, {
        method: 'PATCH'
      })
      // Update local state
      if (currentDay) {
        setCurrentDay({
          ...currentDay,
          exercises: currentDay.exercises.map(ex =>
            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
          )
        })
      }
    } catch (error) {
      console.error('Error toggling exercise:', error)
    }
  }

  const completeWorkout = async () => {
    if (!rotation) return

    // Check if all exercises are completed
    const allCompleted = currentDay?.exercises.every(ex => ex.completed)
    
    if (!allCompleted && !confirm('Not all exercises are checked off. Complete workout anyway?')) {
      return
    }

    try {
      const response = await fetch('/api/rotation/complete', {
        method: 'POST'
      })

      if (response.ok) {
        // Reload rotation data to show next day
        await fetchRotation()
      }
    } catch (error) {
      console.error('Error completing workout:', error)
    }
  }

  const selectDay = async (dayIndex: number) => {
    if (!rotation) return

    try {
      const response = await fetch('/api/rotation/select-day', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayIndex })
      })

      if (response.ok) {
        await fetchRotation()
      }
    } catch (error) {
      console.error('Error selecting day:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  // No rotation set up yet
  if (!rotation || !currentDay) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Today&apos;s Workout</h1>
            <Link href="/settings" className="p-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </header>
        <main className="px-4 py-6">
          <div className="ios-card p-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-800">No Workout Rotation Set Up</h2>
            <p className="text-gray-600">
              Get started by creating your workout rotation in settings.
            </p>
            <Link href="/settings/workout" className="ios-button block">
              Set Up Rotation
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Today&apos;s Workout</h1>
            <p className="text-sm text-gray-500">{currentDay.name}</p>
          </div>
          <Link href="/settings" className="p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Exercise List */}
      <main className="px-4 py-6">
        {/* Day Selector */}
        {rotation.days.length > 1 && (
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {rotation.days
                .sort((a, b) => a.order - b.order)
                .map((day, index) => (
                  <button
                    key={day.id}
                    onClick={() => selectDay(index)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                      index === rotation.currentDayIndex
                        ? 'bg-ios-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {currentDay.exercises
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <div
                key={exercise.id}
                className="ios-card p-4 flex items-start justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{exercise.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatExerciseDisplay(exercise)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total Load: {calculateTotalLoad(exercise).toLocaleString()} lb
                  </p>
                </div>
                <button
                  onClick={() => toggleExerciseComplete(exercise.id)}
                  className={`ml-4 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    exercise.completed
                      ? 'bg-ios-blue border-ios-blue'
                      : 'border-gray-300 hover:border-ios-blue'
                  }`}
                  aria-label={exercise.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {exercise.completed && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
        </div>

        {currentDay.exercises.length === 0 && (
          <div className="ios-card p-6 text-center">
            <p className="text-gray-500">No exercises for today</p>
            <Link href="/settings/workout" className="text-ios-blue text-sm mt-2 inline-block">
              Add Exercises
            </Link>
          </div>
        )}

        {currentDay.exercises.length > 0 && (
          <button
            onClick={completeWorkout}
            className="w-full ios-button mt-6"
          >
            Complete Workout & Move to Next Day
          </button>
        )}
      </main>
    </div>
  )
}
