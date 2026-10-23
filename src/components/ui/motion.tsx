import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import * as m from 'motion/react-m'
import type { ReactNode, RefObject } from 'react'

/** Curva "cinematográfica": arranque rápido e assentamento longo. */
export const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Carrega só o pacote de animações necessário (LazyMotion) e respeita
 * prefers-reduced-motion: com a preferência ativa, deslocamentos e escalas
 * viram transições instantâneas e só a opacidade anima.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}

export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

/** Entrada suave ao rolar: sobe alguns pixels e ganha opacidade. */
export function Reveal({ children, className, delay = 0, y = 26 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </m.div>
  )
}

interface RevealLinesProps {
  lines: ReactNode[]
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
  delay?: number
  /** true = anima ao montar (primeira dobra); false = anima ao entrar na tela. */
  immediate?: boolean
}

/** Título revelado linha a linha, com máscara, como em abertura de filme. */
export function RevealLines({ lines, as: Tag = 'h2', id, className, delay = 0, immediate = false }: RevealLinesProps) {
  const trigger = immediate
    ? { animate: 'shown' as const }
    : { whileInView: 'shown' as const, viewport: VIEWPORT }

  return (
    <Tag id={id} className={className}>
      <m.span className="block" initial="hidden" {...trigger}>
        {lines.map((line, i) => (
          <span key={i} className="-mt-[0.06em] -mb-[0.14em] block overflow-hidden pt-[0.06em] pb-[0.14em]">
            <m.span
              className="block will-change-transform"
              variants={{ hidden: { y: '112%' }, shown: { y: '0%' } }}
              transition={{ duration: 1.15, ease: EASE, delay: delay + i * 0.12 }}
            >
              {line}
            </m.span>
          </span>
        ))}
      </m.span>
    </Tag>
  )
}

/** Parallax discreto: desloca o elemento conforme a seção atravessa a tela. */
export function useParallax(target: RefObject<HTMLElement | null>, distance = 60): MotionValue<number> {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  return useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-distance, distance])
}

export { m }
