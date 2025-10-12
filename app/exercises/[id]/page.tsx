'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  category?: string
  description?: string
  progressionSettings?: {
    currentWeight: number
    currentReps: number
    currentSets: number
    progressionType: string
    growthRate: number
    frequency: string
  }
}

export default function ExerciseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchExercise()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const fetchExercise = async () => {
    try {
      const response = await fetch(`/api/exercises/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setExercise(data)
      }
    } catch (error) {
      console.error('Failed to fetch exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Exercise not found</p>
          <Link href="/exercises" className="text-ios-blue">
            Back to Exercises
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 bg-ios-gray">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/exercises" className="text-ios-blue">
            Back
          </Link>
          <h1 className="text-lg font-semibold truncate max-w-[200px]">{exercise.name}</h1>
          <button className="text-ios-blue">Edit</button>
        </div>
      </header>

      {/* Content */}
      <main className="py-6 space-y-6">
        {/* Exercise Info */}
        <section>
          <h2 className="ios-section-header">Exercise Details</h2>
          <div className="ios-card divide-y divide-gray-200">
            <div className="px-4 py-3">
              <div className="text-sm text-gray-600 mb-1">Name</div>
              <div className="font-medium">{exercise.name}</div>
            </div>
            {exercise.category && (
              <div className="px-4 py-3">
                <div className="text-sm text-gray-600 mb-1">Category</div>
                <div className="font-medium capitalize">{exercise.category}</div>
              </div>
            )}
            {exercise.description && (
              <div className="px-4 py-3">
                <div className="text-sm text-gray-600 mb-1">Description</div>
                <div className="text-gray-700">{exercise.description}</div>
              </div>
            )}
          </div>
        </section>

        {/* Progression Settings */}
        <section>
          <h2 className="ios-section-header">Progression Settings</h2>
          {exercise.progressionSettings ? (
            <div className="ios-card divide-y divide-gray-200">
              <div className="px-4 py-3">
                <div className="text-sm text-gray-600 mb-1">Current Stats</div>
                <div className="font-medium">
                  {exercise.progressionSettings.currentWeight} lbs × {exercise.progressionSettings.currentReps} reps × {exercise.progressionSettings.currentSets} sets
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="text-sm text-gray-600 mb-1">Progression Type</div>
                <div className="font-medium capitalize">{exercise.progressionSettings.progressionType}</div>
              </div>
              <div className="px-4 py-3">
                <div className="text-sm text-gray-600 mb-1">Growth Rate</div>
                <div className="font-medium">
                  {exercise.progressionSettings.progressionType === 'linear' 
                    ? `+${exercise.progressionSettings.growthRate} lbs`
                    : `+${exercise.progressionSettings.growthRate}%`
                  }
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="text-sm text-gray-600 mb-1">Frequency</div>
                <div className="font-medium capitalize">{exercise.progressionSettings.frequency.replace('_', ' ')}</div>
              </div>
            </div>
          ) : (
            <div className="ios-card p-4">
              <p className="text-gray-600 mb-4">No progression settings configured yet.</p>
              <button className="ios-button w-full">
                Set Up Progression
              </button>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="px-4 space-y-3">
          <button className="ios-button w-full">
            Get Recommendation
          </button>
          <button className="ios-button-secondary w-full">
            View History
          </button>
        </section>
      </main>
    </div>
  )
}
