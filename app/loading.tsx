/**
 * Global Loading Component
 * 
 * Displayed while pages are loading (during navigation or data fetching).
 * Provides a consistent loading experience across the app.
 * 
 * Requirements: Error Handling, Loading States
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="inline-block relative w-20 h-20 mb-4">
          <div className="absolute border-4 border-primary-200 rounded-full w-20 h-20"></div>
          <div className="absolute border-4 border-primary-600 border-t-transparent rounded-full w-20 h-20 animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-neutral-600 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
