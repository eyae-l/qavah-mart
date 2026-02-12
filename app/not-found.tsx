'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found Page
 * 
 * Displayed when a user navigates to a page that doesn't exist.
 * Provides helpful navigation options to get back on track.
 * 
 * Requirements: Error Handling
 */

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-200" aria-hidden="true">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="border-t border-neutral-200 pt-8">
          <p className="text-sm text-neutral-600 mb-4">
            Try searching for what you need:
          </p>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 hover:border-primary-600 text-neutral-900 hover:text-primary-700 font-medium rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Search Products
          </Link>
        </div>
      </div>
    </div>
  );
}
