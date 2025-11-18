import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { FeaturedStores } from '@/components/home/FeaturedStores'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { TrendingProducts } from '@/components/home/TrendingProducts'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* Category Showcase */}
      <CategoryShowcase />
      
      {/* Trending Products */}
      <TrendingProducts />
      
      {/* Featured Stores */}
      <FeaturedStores />
      
      {/* Newsletter */}
      <Newsletter />
    </div>
  )
}
