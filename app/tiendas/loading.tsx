import { SkeletonStoreCard } from '@/components/ui/Skeleton'

export default function TiendasLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-16 w-96 bg-white/20 rounded-lg mx-auto mb-6 animate-pulse" />
          <div className="h-8 w-full max-w-3xl bg-white/20 rounded-lg mx-auto animate-pulse" />
        </div>
      </section>

      {/* Stores Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonStoreCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
