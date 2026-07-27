import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import TrustBar from '@/components/TrustBar'
import Templates from '@/components/Templates'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      {/* Hero with full gradient background */}
      <div className="hero-gradient" style={{ display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <HeroSection />
        <TrustBar />
      </div>

      {/* White sections below */}
      <HowItWorks />
      <Templates />
      <Footer />
    </main>
  )
}
