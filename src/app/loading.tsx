import { Container } from '@/components/layout/Container';

export default function Loading() {
  return (
    <Container>
      <div className="py-12 animate-pulse">
        {/* Hero skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 w-48 bg-neutral-200 rounded-lg mx-auto mb-4" />
          <div className="h-12 w-96 max-w-full bg-neutral-200 rounded-lg mx-auto mb-4" />
          <div className="h-6 w-72 max-w-full bg-neutral-100 rounded-lg mx-auto" />
        </div>

        {/* Search bar skeleton */}
        <div className="h-14 max-w-2xl bg-neutral-200 rounded-2xl mx-auto mb-12" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video bg-neutral-200 rounded-2xl" />
              <div className="h-5 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
