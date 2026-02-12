'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

/**
 * Global Error Boundary
 * 
 * Catches and handles errors that occur during rendering in the app.
 * Provides a user-friendly error message and recovery options.
 * 
 * Requirements: Error Handling
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertCircle className="w-12 h-12 text-red-600" aria-hidden="true" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-neutral-600 mb-8">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-left">
            <p className="text-sm font-mono text-neutral-700 break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
