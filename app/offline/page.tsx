'use client'

export const dynamic = 'force-dynamic'

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-ios-gray px-4">
      <div className="text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-20 h-20 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">You&apos;re Offline</h1>
        <p className="text-gray-600 mb-6">
          Check your internet connection to sync your data
        </p>
        <button
          onClick={handleReload}
          className="ios-button inline-block"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
