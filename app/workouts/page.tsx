'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

interface WorkoutSession {
  id: string
  date: string
  completed: boolean
  workoutLogs: {
    id: string
    exercise: {
      name: string
    }
    weight: number
    reps: number
    sets: number
  }[]
}

export default function WorkoutsPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/workouts')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Failed to fetch workout sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Workouts</h1>
          <Link href="/workouts/new" className="text-ios-blue font-semibold">
            New
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">No workouts logged yet</p>
            <Link href="/workouts/new" className="ios-button inline-block">
              Start Your First Workout
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/workouts/${session.id}`}
                className="ios-card p-4 block"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">{formatDate(session.date)}</div>
                  {session.completed && (
                    <div className="text-green-600 text-sm">✓ Completed</div>
                  )}
                </div>
                <div className="space-y-1">
                  {session.workoutLogs.map((log) => (
                    <div key={log.id} className="text-sm text-gray-600">
                      {log.exercise.name}: {log.weight} lbs × {log.reps} × {log.sets}
                    </div>
                  ))}
                  {session.workoutLogs.length === 0 && (
                    <div className="text-sm text-gray-400">No exercises logged</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
        <div className="grid grid-cols-3 h-16">
          <Link href="/" className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/exercises" className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-xs mt-1">Exercises</span>
          </Link>
          <Link href="/workouts" className="flex flex-col items-center justify-center text-ios-blue">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs mt-1">Workouts</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
