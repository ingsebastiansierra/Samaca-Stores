import { Skeleton } from '@/components/ui/Skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <Skeleton className="aspect-square rounded-2xl mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-12 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-24 h-12 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="w-16 h-8" />
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Skeleton className="flex-1 h-14 rounded-lg" />
              <Skeleton className="w-14 h-14 rounded-lg" />
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-gray-200 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
