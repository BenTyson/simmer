import { Container } from '@/components/layout/Container';

export default function RecipeLoading() {
  return (
    <Container>
      <div className="py-8 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="h-4 w-16 bg-neutral-200 rounded" />
          <div className="h-4 w-4 bg-neutral-100 rounded" />
          <div className="h-4 w-32 bg-neutral-200 rounded" />
        </div>

        {/* Title skeleton */}
        <div className="h-10 w-2/3 bg-neutral-200 rounded-lg mb-4" />

        {/* Meta info skeleton */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="h-6 w-24 bg-neutral-100 rounded-full" />
          <div className="h-6 w-28 bg-neutral-100 rounded-full" />
          <div className="h-6 w-20 bg-neutral-100 rounded-full" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-8">
          <div className="h-4 bg-neutral-100 rounded w-full" />
          <div className="h-4 bg-neutral-100 rounded w-5/6" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients column skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-7 w-32 bg-neutral-200 rounded mb-4" />
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-24 bg-neutral-100 rounded-lg" />
                <div className="h-5 w-20 bg-neutral-100 rounded" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-neutral-200 rounded" />
                    <div className="h-4 bg-neutral-100 rounded flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions column skeleton */}
          <div className="lg:col-span-2">
            <div className="h-7 w-32 bg-neutral-200 rounded mb-6" />
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-8 w-8 bg-primary-100 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-100 rounded w-full" />
                    <div className="h-4 bg-neutral-100 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
