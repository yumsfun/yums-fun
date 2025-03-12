import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrendingTokens from '@/components/TrendingTokens';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy">
      <Header />
      
      <div className="container mx-auto px-4 pt-16">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Token Listings */}
        <div className="mb-20">
          <TrendingTokens />
        </div>
      </div>
    </main>
  );
}
