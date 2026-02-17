/**
 * LoadingSpinner Component
 * 
 * Reusable loading spinner for async operations.
 * Provides consistent loading experience across the app.
 * 
 * Requirements: 21.3 - Loading states
 */

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 'medium',
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-20 h-20 border-4',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen bg-white flex items-center justify-center'
    : 'flex items-center justify-center py-8';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block relative">
          <div
            className={`${sizeClasses[size]} border-primary-200 rounded-full`}
            aria-hidden="true"
          />
          <div
            className={`${sizeClasses[size]} border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}
            aria-hidden="true"
          />
        </div>

        {/* Loading Message */}
        {message && (
          <p className="mt-4 text-neutral-600 font-medium">
            {message}
          </p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
