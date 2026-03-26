import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Ticker from '@/components/landing/Ticker'
import Trust from '@/components/landing/Trust'
import PlatformLogos from '@/components/landing/PlatformLogos'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Details from '@/components/landing/Details'
import Stats from '@/components/landing/Stats'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import ScrollReveal from '@/components/landing/ScrollReveal'
import GlowEffect from '@/components/landing/GlowEffect'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Ticker />
      <section id="features">
        <Features />
      </section>
      <PlatformLogos />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="details">
        <Details />
      </section>
      <section id="stats">
        <Stats />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="cta">
        <CTA />
      </section>
      <footer>
        <Footer />
      </footer>
      <ScrollReveal />
      <GlowEffect />
    </>
  )
}
