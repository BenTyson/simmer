import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
        {/* Fun 404 illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-display font-bold text-primary-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-8xl" role="img" aria-label="confused chef">
              🧑‍🍳
            </span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Recipe not found!
        </h1>
        <p className="text-lg text-neutral-600 max-w-md mb-8">
          Looks like this recipe wandered off. Maybe it&apos;s hiding in the pantry?
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button variant="primary" size="lg">
              <Home className="w-5 h-5 mr-2" />
              Back to home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Search recipes
            </Button>
          </Link>
        </div>

        {/* Back link */}
        <Link
          href="javascript:history.back()"
          className="mt-8 text-sm text-neutral-500 hover:text-primary-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </Link>
      </div>
    </Container>
  );
}
