'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface DayExercise {
  id: string
  name: string
  weight: number
  reps: number
  sets: number
  partialReps: number
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
  days: RotationDay[]
}

export default function ChangeWorkoutPage() {
  const router = useRouter()
  const [rotation, setRotation] = useState<WorkoutRotation | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [editingDayName, setEditingDayName] = useState('')

  useEffect(() => {
    fetchRotation()
  }, [])

  const fetchRotation = async () => {
    try {
      const response = await fetch('/api/rotation')
      if (response.ok) {
        const data = await response.json()
        setRotation(data)
      }
    } catch (error) {
      console.error('Error fetching rotation:', error)
    } finally {
      setLoading(false)
    }
  }

  const createRotation = async () => {
    try {
      const response = await fetch('/api/rotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Rotation' })
      })
      if (response.ok) {
        const data = await response.json()
        setRotation(data)
      }
    } catch (error) {
      console.error('Error creating rotation:', error)
    }
  }

  const addDay = async () => {
    if (!rotation) return
    
    try {
      const nextDayNumber = rotation.days.length + 1
      const response = await fetch('/api/rotation/days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rotationId: rotation.id,
          dayNumber: nextDayNumber,
          name: `Day ${nextDayNumber}`,
          order: nextDayNumber - 1
        })
      })
      if (response.ok) {
        await fetchRotation()
      }
    } catch (error) {
      console.error('Error adding day:', error)
    }
  }

  const updateDayName = async (dayId: string) => {
    try {
      const response = await fetch(`/api/rotation/days/${dayId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingDayName })
      })
      if (response.ok) {
        setEditingDayId(null)
        setEditingDayName('')
        await fetchRotation()
      }
    } catch (error) {
      console.error('Error updating day name:', error)
    }
  }

  const startEditingDayName = (day: RotationDay) => {
    setEditingDayId(day.id)
    setEditingDayName(day.name)
  }

  const calculateTotalLoad = (exercise: DayExercise) => {
    return exercise.weight * exercise.reps * exercise.sets + exercise.weight * exercise.partialReps
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!rotation) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center">
            <button onClick={() => router.back()} className="mr-3">
              <svg className="w-6 h-6 text-ios-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Change Workout</h1>
          </div>
        </header>
        <main className="px-4 py-6">
          <div className="ios-card p-6 text-center space-y-4">
            <h2 className="text-xl font-bold">No Rotation Created</h2>
            <p className="text-gray-600">Create your first workout rotation to get started.</p>
            <button onClick={createRotation} className="ios-button">
              Create Rotation
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center">
          <button onClick={() => router.back()} className="mr-3">
            <svg className="w-6 h-6 text-ios-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Change Workout</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <section>
          <h2 className="ios-section-header">Current Rotation</h2>
          
          {rotation.days.length === 0 ? (
            <div className="ios-card p-6 text-center">
              <p className="text-gray-500 mb-4">No days created yet</p>
              <button onClick={addDay} className="ios-button">
                Add First Day
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rotation.days
                .sort((a, b) => a.order - b.order)
                .map((day) => (
                  <div key={day.id} className="ios-card">
                    <div className="p-4 border-b border-gray-200">
                      {editingDayId === day.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingDayName}
                            onChange={(e) => setEditingDayName(e.target.value)}
                            className="ios-input flex-1"
                            placeholder="Day name"
                            autoFocus
                          />
                          <button
                            onClick={() => updateDayName(day.id)}
                            className="px-3 py-2 text-ios-blue font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDayId(null)}
                            className="px-3 py-2 text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{day.name}</h3>
                            <button
                              onClick={() => startEditingDayName(day)}
                              className="p-1 text-gray-400 hover:text-ios-blue"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </div>
                          <Link
                            href={`/settings/workout/day/${day.id}`}
                            className="text-ios-blue text-sm font-medium"
                          >
                            Edit Exercises
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    {day.exercises.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No exercises yet
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {day.exercises
                          .sort((a, b) => a.order - b.order)
                          .map((exercise) => (
                            <div key={exercise.id} className="p-4 flex items-center justify-between">
                              <div>
                                <p className="font-medium">{exercise.name}</p>
                                <p className="text-sm text-gray-600">
                                  {exercise.weight} lb × {exercise.reps} reps × {exercise.sets} sets
                                  {exercise.partialReps > 0 && ` + ${exercise.partialReps}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">
                                  {calculateTotalLoad(exercise).toLocaleString()} lb
                                </p>
                                <p className="text-xs text-gray-500">total load</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>

        <button
          onClick={addDay}
          className="w-full ios-card p-4 text-center text-ios-blue font-medium flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </main>
    </div>
  )
}
