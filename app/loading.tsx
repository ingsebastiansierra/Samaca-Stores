import { 
  HeroSkeleton, 
  FeaturedProductsSkeleton, 
  CategoryShowcaseSkeleton, 
  FeaturedStoresSkeleton 
} from '@/components/skeletons/HomeSkeletons'

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSkeleton />
      <FeaturedProductsSkeleton />
      <CategoryShowcaseSkeleton />
      <FeaturedProductsSkeleton />
      <FeaturedStoresSkeleton />
    </div>
  )
}
