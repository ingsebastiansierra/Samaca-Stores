import { 
  StoreBannerSkeleton, 
  StoreInfoSkeleton, 
  StoreCategoriesSkeleton, 
  StoreProductsSkeleton 
} from '@/components/skeletons/StoreSkeletons'

export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-white">
      <StoreBannerSkeleton />
      <StoreInfoSkeleton />
      <StoreCategoriesSkeleton />
      <StoreProductsSkeleton />
    </div>
  )
}
