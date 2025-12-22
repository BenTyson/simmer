'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCcw, AlertTriangle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
        {/* Error illustration */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Something went wrong!
        </h1>
        <p className="text-lg text-neutral-600 max-w-md mb-8">
          Our kitchen had a little mishap. Don&apos;t worry, our chefs are on it!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" size="lg" onClick={reset}>
            <RotateCcw className="w-5 h-5 mr-2" />
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="w-5 h-5 mr-2" />
              Back to home
            </Button>
          </Link>
        </div>

        {/* Error details for debugging */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-neutral-100 rounded-lg text-left max-w-lg">
            <p className="text-sm font-mono text-neutral-600 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-neutral-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
