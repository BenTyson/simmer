import { Container } from '@/components/layout/Container';

export default function SearchLoading() {
  return (
    <Container>
      <div className="py-8 animate-pulse">
        {/* Search header skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-neutral-200 rounded-lg mb-4" />
          <div className="h-14 max-w-2xl bg-neutral-200 rounded-2xl" />
        </div>

        {/* Filters skeleton */}
        <div className="flex gap-3 mb-8 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-neutral-100 rounded-full shrink-0" />
          ))}
        </div>

        {/* Results count skeleton */}
        <div className="h-5 w-32 bg-neutral-100 rounded mb-6" />

        {/* Results grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="aspect-video bg-neutral-200 rounded-xl mb-4" />
              <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-neutral-100 rounded w-full mb-3" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-neutral-100 rounded-full" />
                <div className="h-6 w-20 bg-neutral-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
