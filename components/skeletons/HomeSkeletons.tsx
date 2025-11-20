import { Skeleton, SkeletonProductCard } from '@/components/ui/Skeleton'

export function HeroSkeleton() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center bg-black">
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <Skeleton className="h-12 w-64 mx-auto mb-6 bg-white/20" />
        <Skeleton className="h-24 w-full max-w-3xl mx-auto mb-6 bg-white/20" />
        <Skeleton className="h-16 w-full max-w-2xl mx-auto mb-12 bg-white/20" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-14 w-48 rounded-full bg-white/20" />
          <Skeleton className="h-14 w-48 rounded-full bg-white/20" />
        </div>
      </div>
    </section>
  )
}

export function FeaturedProductsSkeleton() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-6 w-64" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Skeleton className="h-14 w-64 mx-auto rounded-full" />
        </div>
      </div>
    </section>
  )
}

export function CategoryShowcaseSkeleton() {
  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-64 mx-auto bg-white/20" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturedStoresSkeleton() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-6 w-64" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-2 border-black rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
