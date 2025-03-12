'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-500 text-white p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-primary text-9xl font-bold">404</div>
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-400 mb-8">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-3 bg-primary text-navy-700 rounded-full font-medium hover:bg-primary-400 transition-all hover:shadow-md"
          >
            Back to Home
          </Link>
          <Link 
            href="/explore"
            className="px-6 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary/10 transition-all"
          >
            Explore Tokens
          </Link>
        </div>
      </div>
    </div>
  );
} 