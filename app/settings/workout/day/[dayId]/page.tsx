'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

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
  exercises: DayExercise[]
}

export default function EditDayPage() {
  const params = useParams()
  const router = useRouter()
  const [day, setDay] = useState<RotationDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [exerciseName, setExerciseName] = useState('')
  const [weight, setWeight] = useState('45')
  const [reps, setReps] = useState('10')
  const [sets, setSets] = useState('3')
  const [partialReps, setPartialReps] = useState('0')

  useEffect(() => {
    fetchDay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchDay = async () => {
    try {
      const response = await fetch(`/api/rotation/days/${params.dayId}`)
      if (response.ok) {
        const data = await response.json()
        setDay(data)
      }
    } catch (error) {
      console.error('Error fetching day:', error)
    } finally {
      setLoading(false)
    }
  }

  const addExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!day || !exerciseName.trim()) return

    try {
      const response = await fetch('/api/rotation/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayId: day.id,
          name: exerciseName,
          weight: parseFloat(weight),
          reps: parseInt(reps),
          sets: parseInt(sets),
          partialReps: parseInt(partialReps),
          order: day.exercises.length
        })
      })
      
      if (response.ok) {
        setExerciseName('')
        setWeight('45')
        setReps('10')
        setSets('3')
        setPartialReps('0')
        setShowAddForm(false)
        await fetchDay()
      }
    } catch (error) {
      console.error('Error adding exercise:', error)
    }
  }

  const updateExercise = async (exerciseId: string) => {
    try {
      const response = await fetch(`/api/rotation/exercises/${exerciseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: exerciseName,
          weight: parseFloat(weight),
          reps: parseInt(reps),
          sets: parseInt(sets),
          partialReps: parseInt(partialReps)
        })
      })
      
      if (response.ok) {
        setEditingId(null)
        setExerciseName('')
        await fetchDay()
      }
    } catch (error) {
      console.error('Error updating exercise:', error)
    }
  }

  const deleteExercise = async (exerciseId: string) => {
    if (!confirm('Delete this exercise?')) return
    
    try {
      const response = await fetch(`/api/rotation/exercises/${exerciseId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchDay()
      }
    } catch (error) {
      console.error('Error deleting exercise:', error)
    }
  }

  const startEdit = (exercise: DayExercise) => {
    setEditingId(exercise.id)
    setExerciseName(exercise.name)
    setWeight(exercise.weight.toString())
    setReps(exercise.reps.toString())
    setSets(exercise.sets.toString())
    setPartialReps(exercise.partialReps.toString())
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!day) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Day not found</p>
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
          <h1 className="text-2xl font-bold">{day.name}</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {/* Exercise List */}
        {day.exercises
          .sort((a, b) => a.order - b.order)
          .map((exercise) => (
            <div key={exercise.id} className="ios-card">
              {editingId === exercise.id ? (
                <div className="p-4 space-y-3">
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    className="ios-input w-full"
                    placeholder="Exercise name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">Weight (lb)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="ios-input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Reps</label>
                      <input
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="ios-input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Sets</label>
                      <input
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        className="ios-input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Partial Reps</label>
                      <input
                        type="number"
                        value={partialReps}
                        onChange={(e) => setPartialReps(e.target.value)}
                        className="ios-input w-full"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateExercise(exercise.id)}
                      className="ios-button flex-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                      <p className="text-sm text-gray-600">
                        {exercise.weight} lb × {exercise.reps} reps × {exercise.sets} sets
                        {exercise.partialReps > 0 && ` + ${exercise.partialReps}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(exercise)}
                      className="flex-1 px-4 py-2 text-ios-blue bg-blue-50 rounded-lg text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExercise(exercise.id)}
                      className="flex-1 px-4 py-2 text-red-600 bg-red-50 rounded-lg text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

        {/* Add Exercise Form */}
        {showAddForm ? (
          <div className="ios-card p-4 space-y-3">
            <h3 className="font-semibold">Add Exercise</h3>
            <form onSubmit={addExercise} className="space-y-3">
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="ios-input w-full"
                placeholder="Exercise name"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Weight (lb)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="ios-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Reps</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="ios-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Sets</label>
                  <input
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className="ios-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Partial Reps</label>
                  <input
                    type="number"
                    value={partialReps}
                    onChange={(e) => setPartialReps(e.target.value)}
                    className="ios-input w-full"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="ios-button flex-1">
                  Add Exercise
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full ios-card p-4 text-center text-ios-blue font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Exercise
          </button>
        )}
      </main>
    </div>
  )
}
