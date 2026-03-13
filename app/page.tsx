import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import SatelliteLayerSection from '@/components/sections/SatelliteLayerSection'
import AIAnalysisSection from '@/components/sections/AIAnalysisSection'
import PlatformPreviewSection from '@/components/sections/PlatformPreviewSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <h1 className="text-5xl font-bold">
        TerraSentinel
      </h1>
      <p>
        Earth Intelligence Platform
      </p>
       
      <Navbar />
      <HeroSection />
      <SatelliteLayerSection />
      <AIAnalysisSection />
      <PlatformPreviewSection />
      <Footer />
    </main>
  )
}
