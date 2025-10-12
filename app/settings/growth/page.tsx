'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface GrowthSettings {
  id: string
  rotationId: string
  growthType: string
  amount: number
  frequency: string
}

export default function ChangeGrowthRatePage() {
  const router = useRouter()
  const [settings, setSettings] = useState<GrowthSettings | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [growthType, setGrowthType] = useState('percent')
  const [amount, setAmount] = useState(5.0)
  const [frequency, setFrequency] = useState('rotation')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/rotation/growth')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setSettings(data)
          setGrowthType(data.growthType)
          setAmount(data.amount)
          setFrequency(data.frequency)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/rotation/growth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          growthType,
          amount,
          frequency
        })
      })

      if (response.ok) {
        router.back()
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
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
            <h1 className="text-2xl font-bold">Change Growth Rate</h1>
          </div>
          <button onClick={saveSettings} className="text-ios-blue font-semibold">
            Save
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Growth Type */}
        <section>
          <h2 className="ios-section-header">Growth Type</h2>
          <div className="ios-card divide-y divide-gray-200">
            <label className="p-4 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">Linear</div>
                <div className="text-sm text-gray-500">Add fixed amount (e.g., +5 lbs)</div>
              </div>
              <input
                type="radio"
                name="growthType"
                value="linear"
                checked={growthType === 'linear'}
                onChange={(e) => setGrowthType(e.target.value)}
                className="w-5 h-5 text-ios-blue"
              />
            </label>
            <label className="p-4 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">Percent</div>
                <div className="text-sm text-gray-500">Add percentage (e.g., +5%)</div>
              </div>
              <input
                type="radio"
                name="growthType"
                value="percent"
                checked={growthType === 'percent'}
                onChange={(e) => setGrowthType(e.target.value)}
                className="w-5 h-5 text-ios-blue"
              />
            </label>
            <label className="p-4 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">Sigmoid</div>
                <div className="text-sm text-gray-500">Coming soon - we&apos;ll work on this together</div>
              </div>
              <input
                type="radio"
                name="growthType"
                value="sigmoid"
                checked={growthType === 'sigmoid'}
                onChange={(e) => setGrowthType(e.target.value)}
                className="w-5 h-5 text-ios-blue"
                disabled
              />
            </label>
          </div>
        </section>

        {/* Growth Amount */}
        <section>
          <h2 className="ios-section-header">Growth Amount</h2>
          <div className="ios-card p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {growthType === 'linear' ? 'Amount (lbs)' : 'Amount (%)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="ios-input w-full"
              step={growthType === 'linear' ? '5' : '1'}
              min="0"
            />
            <p className="text-xs text-gray-500 mt-2">
              {growthType === 'linear'
                ? 'Fixed weight to add when progressing'
                : 'Percentage of current weight to add when progressing'}
            </p>
          </div>
        </section>

        {/* Frequency */}
        <section>
          <h2 className="ios-section-header">Progression Frequency</h2>
          <div className="ios-card divide-y divide-gray-200">
            <label className="p-4 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">Every Day</div>
                <div className="text-sm text-gray-500">Progress after every single workout</div>
              </div>
              <input
                type="radio"
                name="frequency"
                value="day"
                checked={frequency === 'day'}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-5 h-5 text-ios-blue"
              />
            </label>
            <label className="p-4 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">Each Rotation</div>
                <div className="text-sm text-gray-500">Progress after completing full rotation cycle</div>
              </div>
              <input
                type="radio"
                name="frequency"
                value="rotation"
                checked={frequency === 'rotation'}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-5 h-5 text-ios-blue"
              />
            </label>
            <label className="p-4 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-medium">Every Week</div>
                <div className="text-sm text-gray-500">Progress after 7 days since last update</div>
              </div>
              <input
                type="radio"
                name="frequency"
                value="week"
                checked={frequency === 'week'}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-5 h-5 text-ios-blue"
              />
            </label>
          </div>
        </section>
      </main>
    </div>
  )
}
