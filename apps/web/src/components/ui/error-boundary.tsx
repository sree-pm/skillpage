'use client';
import { useEffect, useState } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
      setError(error.error);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    if (fallback) return fallback;
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="card p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-text-secondary mb-6">We're sorry, but an unexpected error occurred.</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reload page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function ApiError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card p-6 border-l-4 border-error bg-error/5">
      <div className="flex items-start gap-3">
        <div className="text-2xl">❌</div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Failed to load data</h3>
          <p className="text-text-secondary text-sm">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn-secondary mt-4 text-sm">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
