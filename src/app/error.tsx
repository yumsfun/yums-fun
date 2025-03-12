'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-500 text-white p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-accent-red text-6xl font-bold mb-4">Oops!</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 mb-4">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-navy-700 rounded-full font-medium hover:bg-primary-400 transition-all hover:shadow-md"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="px-6 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary/10 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 