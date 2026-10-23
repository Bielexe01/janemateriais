import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import { whatsappHref } from '../lib/links'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { EASE, m } from './ui/motion'

/** Deslocamento mínimo (px) para decidir a direção da rolagem, sem tremer. */
const DIRECTION_THRESHOLD = 6

/**
 * Aparece depois da primeira dobra e some quando a seção de contato ou o
 * rodapé estão na tela (lá já existem botões de WhatsApp). Enquanto a pessoa
 * desce a página lendo, ele se recolhe para não cobrir o conteúdo, e volta
 * assim que ela sobe a página. O WhatsApp do cabeçalho segue sempre visível.
 */
export function FloatingWhatsApp() {
  const { scrollY } = useScroll()
  const [pastHero, setPastHero] = useState(false)
  const [readingDown, setReadingDown] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const lastY = useRef(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setPastHero(y > window.innerHeight * 0.7)
    const delta = y - lastY.current
    if (Math.abs(delta) < DIRECTION_THRESHOLD) return
    setReadingDown(delta > 0)
    lastY.current = y
  })

  useEffect(() => {
    const targets = [document.getElementById('contato'), document.querySelector('footer')].filter(
      (el): el is HTMLElement => el !== null,
    )
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setBlocked(visible.size > 0)
    })
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const show = pastHero && !blocked && !readingDown

  return (
    <AnimatePresence>
      {show && (
        <m.a
          key="whatsapp-float"
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale pelo WhatsApp (abre em nova aba)"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex h-14 items-center gap-3 rounded-full bg-brand pr-5 pl-4 font-semibold text-white shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] transition-colors hover:bg-brand-600 sm:right-6 sm:bottom-6 lg:hidden max-sm:w-14 max-sm:justify-center max-sm:p-0"
        >
          <WhatsAppIcon className="size-6 transition-transform duration-500 ease-spring group-hover:-rotate-12 group-hover:scale-110" />
          <span className="max-sm:sr-only">WhatsApp</span>
        </m.a>
      )}
    </AnimatePresence>
  )
}
