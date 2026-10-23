import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '../config/nav'
import { SITE } from '../config/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { cn } from '../lib/cn'
import { whatsappHref } from '../lib/links'
import { Logo } from './Logo'
import { WhatsAppButton } from './ui/Button'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { EASE, m } from './ui/motion'

const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

export function Header() {
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))
  useEffect(() => setScrolled(window.scrollY > 24), [])

  // Menu mobile: trava a rolagem, foca o primeiro link e fecha com Esc.
  useLayoutEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onChange = () => desktop.matches && setMenuOpen(false)
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  const solid = scrolled || menuOpen

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ease-cine',
        solid ? 'border-white/[0.07] bg-graphite/90 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
    >
      <div className="container-x flex h-(--header-h) items-center justify-between gap-6">
        <a href="#inicio" className="rounded-md text-bone" aria-label={`${SITE.name}: voltar ao início`}>
          <Logo />
        </a>

        <nav aria-label="Seções da página" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.82rem] font-medium transition-colors duration-300',
                      isActive ? 'text-bone' : 'text-steel-300 hover:text-bone',
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ember transition-[opacity,scale] duration-500 ease-cine',
                        isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                      )}
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapper: a base do botão já define display (inline-flex), então
              o "hidden" precisa ficar num elemento próprio para valer no celular. */}
          <div className="hidden sm:block">
            <WhatsAppButton size="sm">Fale conosco</WhatsAppButton>
          </div>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco pelo WhatsApp (abre em nova aba)"
            className="grid size-11 place-items-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-600 sm:hidden"
          >
            <WhatsAppIcon className="size-5" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="grid size-11 place-items-center rounded-xl border border-white/15 text-bone transition-colors hover:border-white/40 lg:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {/* Indicador de leitura: linha laranja que acompanha a rolagem. */}
      <m.div
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-ember"
        style={{ scaleX: scrollYProgress }}
      />

    </header>

    {/* Fora do <header>: o backdrop-blur do cabeçalho vira o "containing block"
        dos filhos position:fixed, e o painel ficava espremido em 72px de altura. */}
    <AnimatePresence>
      {menuOpen && (
        <m.div
          id="menu-mobile"
          ref={panelRef}
          className="fixed inset-x-0 top-(--header-h) bottom-0 z-[45] bg-graphite lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <nav aria-label="Menu" className="container-x flex h-full flex-col justify-between gap-10 overflow-y-auto py-10">
            <ul>
              {NAV_ITEMS.map((item, i) => (
                <m.li
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.7, ease: EASE }}
                  className="border-b border-white/[0.07]"
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 py-4 font-display text-[2rem] leading-none text-bone"
                  >
                    <span className="text-xs tracking-[0.2em] text-ember">0{i + 1}</span>
                    {item.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <WhatsAppButton size="lg" className="w-full" />
          </nav>
        </m.div>
      )}
    </AnimatePresence>
    </>
  )
}
