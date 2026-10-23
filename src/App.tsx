import { useEffect } from 'react'
import { About } from './components/About'
import { ContactCta } from './components/ContactCta'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Location } from './components/Location'
import { Reviews } from './components/Reviews'
import { MotionProvider } from './components/ui/motion'
import { warnPendingConfig } from './lib/configCheck'

export default function App() {
  useEffect(() => {
    if (import.meta.env.DEV) warnPendingConfig()
  }, [])

  return (
    <MotionProvider>
      <a
        href="#conteudo"
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-transform focus-visible:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <ContactCta />
        <Location />
        <Reviews />
        <Gallery />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </MotionProvider>
  )
}
