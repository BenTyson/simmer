import { Container } from '@/components/layout/Container';

export default function CategoryLoading() {
  return (
    <Container>
      <div className="py-8 animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-neutral-200 rounded-lg mb-2" />
          <div className="h-5 w-64 bg-neutral-100 rounded" />
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-neutral-100 rounded-full" />
          ))}
        </div>

        {/* Results count skeleton */}
        <div className="h-5 w-24 bg-neutral-100 rounded mb-6" />

        {/* Recipe grid skeleton */}
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
