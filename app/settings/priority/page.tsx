'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PriorityRules {
  id: string
  rotationId: string
  repPriority: number
  setPriority: number
  weightPriority: number
  repMax: number
  repMin: number
  setMax: number
  setMin: number
  repsToSetsMultiplier: number
  weightRange: number
  weightIncrement: number
  overEstimateTolerance: number
}

export default function ChangePriorityPage() {
  const router = useRouter()
  const [rules, setRules] = useState<PriorityRules | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [repPriority, setRepPriority] = useState(1)
  const [setPriority, setSetPriority] = useState(2)
  const [weightPriority, setWeightPriority] = useState(3)
  const [repMax, setRepMax] = useState(15)
  const [repMin, setRepMin] = useState(8)
  const [setMax, setSetMax] = useState(5)
  const [setMin, setSetMin] = useState(2)
  const [repsToSetsMultiplier, setRepsToSetsMultiplier] = useState(2.0)
  const [weightRange, setWeightRange] = useState(10.0)
  const [weightIncrement, setWeightIncrement] = useState(2.5)
  const [overEstimateTolerance, setOverEstimateTolerance] = useState(0.5)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/rotation/priority')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setRules(data)
          setRepPriority(data.repPriority)
          setSetPriority(data.setPriority)
          setWeightPriority(data.weightPriority)
          setRepMax(data.repMax)
          setRepMin(data.repMin)
          setSetMax(data.setMax)
          setSetMin(data.setMin)
          setRepsToSetsMultiplier(data.repsToSetsMultiplier)
          setWeightRange(data.weightRange)
          setWeightIncrement(data.weightIncrement || 2.5)
          setOverEstimateTolerance(data.overEstimateTolerance || 0.5)
        }
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveRules = async () => {
    try {
      const response = await fetch('/api/rotation/priority', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repPriority,
          setPriority,
          weightPriority,
          repMax,
          repMin,
          setMax,
          setMin,
          repsToSetsMultiplier,
          weightRange,
          weightIncrement,
          overEstimateTolerance
        })
      })

      if (response.ok) {
        router.back()
      }
    } catch (error) {
      console.error('Error saving rules:', error)
    }
  }

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return '1st'
    if (priority === 2) return '2nd'
    if (priority === 3) return '3rd'
    return `${priority}th`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="mr-3">
              <svg className="w-6 h-6 text-ios-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Change Priority</h1>
          </div>
          <button onClick={saveRules} className="text-ios-blue font-semibold">
            Save
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Priority Order */}
        <section>
          <h2 className="ios-section-header">Current Priority Order</h2>
          <div className="ios-card divide-y divide-gray-200">
            <div className="p-4 flex items-center justify-between">
              <span className="font-medium">Reps Priority</span>
              <select
                value={repPriority}
                onChange={(e) => setRepPriority(parseInt(e.target.value))}
                className="ios-input w-20"
              >
                <option value={1}>1st</option>
                <option value={2}>2nd</option>
                <option value={3}>3rd</option>
              </select>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-medium">Sets Priority</span>
              <select
                value={setPriority}
                onChange={(e) => setSetPriority(parseInt(e.target.value))}
                className="ios-input w-20"
              >
                <option value={1}>1st</option>
                <option value={2}>2nd</option>
                <option value={3}>3rd</option>
              </select>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-medium">Weight Priority</span>
              <select
                value={weightPriority}
                onChange={(e) => setWeightPriority(parseInt(e.target.value))}
                className="ios-input w-20"
              >
                <option value={1}>1st</option>
                <option value={2}>2nd</option>
                <option value={3}>3rd</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Partial Reps</span>
                <span className="text-gray-500">Always 4th</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Partial reps are always the last priority</p>
            </div>
          </div>
        </section>

        {/* Rules */}
        <section>
          <h2 className="ios-section-header">Constraints</h2>
          <div className="ios-card divide-y divide-gray-200">
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rep Max</label>
              <input
                type="number"
                value={repMax}
                onChange={(e) => setRepMax(parseInt(e.target.value))}
                className="ios-input w-full"
                min="1"
              />
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rep Min</label>
              <input
                type="number"
                value={repMin}
                onChange={(e) => setRepMin(parseInt(e.target.value))}
                className="ios-input w-full"
                min="1"
              />
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Set Max</label>
              <input
                type="number"
                value={setMax}
                onChange={(e) => setSetMax(parseInt(e.target.value))}
                className="ios-input w-full"
                min="1"
              />
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Set Min</label>
              <input
                type="number"
                value={setMin}
                onChange={(e) => setSetMin(parseInt(e.target.value))}
                className="ios-input w-full"
                min="1"
              />
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reps &gt; (X × Sets) Multiplier
              </label>
              <input
                type="number"
                value={repsToSetsMultiplier}
                onChange={(e) => setRepsToSetsMultiplier(parseFloat(e.target.value))}
                className="ios-input w-full"
                step="0.1"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Reps must be greater than this multiplier times sets
              </p>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Range (± lbs)
              </label>
              <input
                type="number"
                value={weightRange}
                onChange={(e) => setWeightRange(parseFloat(e.target.value))}
                className="ios-input w-full"
                step="0.5"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Weight changes must be within this range
              </p>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Increment (lbs)
              </label>
              <input
                type="number"
                value={weightIncrement}
                onChange={(e) => setWeightIncrement(parseFloat(e.target.value))}
                className="ios-input w-full"
                step="0.5"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Round weights to nearest increment (2.5 lb standard, 5 lb, or 1 lb microplates)
              </p>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Over-Estimate Tolerance (%)
              </label>
              <input
                type="number"
                value={overEstimateTolerance}
                onChange={(e) => setOverEstimateTolerance(parseFloat(e.target.value))}
                className="ios-input w-full"
                step="0.1"
                min="0"
                max="2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Allow load up to X% above target to avoid partial reps (e.g., 0.5% = accept slightly higher load)
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
