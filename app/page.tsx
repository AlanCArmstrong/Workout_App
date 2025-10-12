import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">Workout Progression</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <section>
          <h2 className="ios-section-header">Quick Actions</h2>
          <div className="ios-card divide-y divide-gray-200">
            <Link href="/exercises" className="ios-list-item flex items-center justify-between">
              <span className="font-medium">My Exercises</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/workouts" className="ios-list-item flex items-center justify-between">
              <span className="font-medium">Workout History</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/workouts/new" className="ios-list-item flex items-center justify-between">
              <span className="font-medium text-ios-blue">Start New Workout</span>
              <svg className="w-5 h-5 text-ios-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Stats Overview (Placeholder) */}
        <section>
          <h2 className="ios-section-header">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="ios-card p-4">
              <div className="text-2xl font-bold text-ios-blue">0</div>
              <div className="text-sm text-gray-600">Total Exercises</div>
            </div>
            <div className="ios-card p-4">
              <div className="text-2xl font-bold text-ios-blue">0</div>
              <div className="text-sm text-gray-600">Workouts Logged</div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="ios-section-header">Getting Started</h2>
          <div className="ios-card p-4 space-y-3">
            <p className="text-gray-700">
              Welcome to Workout Progression! This app helps you track your exercises and calculate progressive overload.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Add your exercises</li>
              <li>Set progression goals (weight, growth rate, frequency)</li>
              <li>Log your workouts</li>
              <li>Get recommendations for your next session</li>
            </ol>
            <Link href="/exercises/new" className="ios-button block text-center mt-4">
              Add Your First Exercise
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
        <div className="grid grid-cols-3 h-16">
          <Link href="/" className="flex flex-col items-center justify-center text-ios-blue">
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
          <Link href="/workouts" className="flex flex-col items-center justify-center text-gray-400">
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
