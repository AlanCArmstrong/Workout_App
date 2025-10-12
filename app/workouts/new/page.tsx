'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  progressionSettings?: {
    currentWeight: number
    currentReps: number
    currentSets: number
  }
}

interface WorkoutLog {
  exerciseId: string
  exerciseName: string
  weight: number
  reps: number
  sets: number
}

export default function NewWorkoutPage() {
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      if (response.ok) {
        const data = await response.json()
        setExercises(data)
      }
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
    }
  }

  const addExercise = (exercise: Exercise) => {
    const existing = workoutLogs.find(log => log.exerciseId === exercise.id)
    if (existing) return

    setWorkoutLogs([...workoutLogs, {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      weight: exercise.progressionSettings?.currentWeight || 0,
      reps: exercise.progressionSettings?.currentReps || 10,
      sets: exercise.progressionSettings?.currentSets || 3,
    }])
  }

  const updateLog = (index: number, field: keyof WorkoutLog, value: number) => {
    const updated = [...workoutLogs]
    updated[index] = { ...updated[index], [field]: value }
    setWorkoutLogs(updated)
  }

  const removeLog = (index: number) => {
    setWorkoutLogs(workoutLogs.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (workoutLogs.length === 0) {
      alert('Add at least one exercise to your workout')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          notes,
          workoutLogs: workoutLogs.map(log => ({
            exerciseId: log.exerciseId,
            weight: log.weight,
            reps: log.reps,
            sets: log.sets,
            completed: true,
          })),
        }),
      })

      if (response.ok) {
        router.push('/workouts')
      }
    } catch (error) {
      console.error('Failed to save workout:', error)
      alert('Failed to save workout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-ios-gray">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/workouts" className="text-ios-blue">
            Cancel
          </Link>
          <h1 className="text-lg font-semibold">New Workout</h1>
          <button
            onClick={handleSave}
            disabled={workoutLogs.length === 0 || loading}
            className="text-ios-blue font-semibold disabled:text-gray-400"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="py-6 space-y-6">
        {/* Workout Logs */}
        {workoutLogs.length > 0 && (
          <section>
            <h2 className="ios-section-header">Exercises</h2>
            <div className="space-y-3 px-4">
              {workoutLogs.map((log, index) => (
                <div key={index} className="ios-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">{log.exerciseName}</div>
                    <button
                      onClick={() => removeLog(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Weight (lbs)</label>
                      <input
                        type="number"
                        value={log.weight}
                        onChange={(e) => updateLog(index, 'weight', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        step="2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Reps</label>
                      <input
                        type="number"
                        value={log.reps}
                        onChange={(e) => updateLog(index, 'reps', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Sets</label>
                      <input
                        type="number"
                        value={log.sets}
                        onChange={(e) => updateLog(index, 'sets', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Add Exercise */}
        <section>
          <h2 className="ios-section-header">Add Exercise</h2>
          {exercises.length === 0 ? (
            <div className="ios-card p-4 mx-4">
              <p className="text-gray-600 mb-4">No exercises available. Create some first!</p>
              <Link href="/exercises/new" className="ios-button block text-center">
                Add Exercise
              </Link>
            </div>
          ) : (
            <div className="ios-card divide-y divide-gray-200">
              {exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => addExercise(exercise)}
                  disabled={workoutLogs.some(log => log.exerciseId === exercise.id)}
                  className="ios-list-item flex items-center justify-between w-full disabled:opacity-50"
                >
                  <div className="text-left">
                    <div className="font-medium">{exercise.name}</div>
                    {exercise.progressionSettings && (
                      <div className="text-sm text-gray-500 mt-1">
                        {exercise.progressionSettings.currentWeight} lbs × {exercise.progressionSettings.currentReps} × {exercise.progressionSettings.currentSets}
                      </div>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-ios-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Notes */}
        <section>
          <h2 className="ios-section-header">Notes (Optional)</h2>
          <div className="ios-card p-4 mx-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did the workout go?"
              rows={4}
              className="w-full focus:outline-none resize-none"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
