'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function NewExercisePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, description }),
      })

      if (response.ok) {
        const exercise = await response.json()
        router.push(`/exercises/${exercise.id}`)
      }
    } catch (error) {
      console.error('Failed to create exercise:', error)
      alert('Failed to create exercise')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-ios-gray">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/exercises" className="text-ios-blue">
            Cancel
          </Link>
          <h1 className="text-lg font-semibold">New Exercise</h1>
          <button
            onClick={handleSubmit}
            disabled={!name || loading}
            className="text-ios-blue font-semibold disabled:text-gray-400"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <div className="ios-card divide-y divide-gray-200">
              <div className="px-4 py-3">
                <label className="block text-sm text-gray-600 mb-2">Exercise Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Bench Press"
                  className="w-full text-lg focus:outline-none"
                  required
                />
              </div>
              <div className="px-4 py-3">
                <label className="block text-sm text-gray-600 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-lg focus:outline-none bg-transparent"
                >
                  <option value="">Select category</option>
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="legs">Legs</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="arms">Arms</option>
                  <option value="core">Core</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="px-4 py-3">
                <label className="block text-sm text-gray-600 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional notes about this exercise"
                  rows={3}
                  className="w-full focus:outline-none resize-none"
                />
              </div>
            </div>
          </section>

          <section className="px-4">
            <p className="text-sm text-gray-500">
              After creating the exercise, you&apos;ll be able to set progression goals (starting weight, growth rate, etc.)
            </p>
          </section>
        </form>
      </main>
    </div>
  )
}
