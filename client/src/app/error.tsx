'use client';

import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="bg-red-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-red-500">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-secondary leading-relaxed">
          An unexpected error occurred. Please try refreshing the page or contact the administrator.
        </p>
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all mx-auto shadow-xl shadow-primary/30"
        >
          <RefreshCcw size={20} /> Try Again
        </button>
      </div>
    </div>
  );
}
