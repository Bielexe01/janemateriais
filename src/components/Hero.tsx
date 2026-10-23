import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, BrickWall, Handshake, MapPin, Navigation } from 'lucide-react'
import { SITE } from '../config/site'
import { cn } from '../lib/cn'
import { mapsDirectionsHref } from '../lib/links'
import { ButtonLink, WhatsAppButton } from './ui/Button'
import { EASE, RevealLines, m } from './ui/motion'

const ATTRIBUTES = [
  { icon: Handshake, label: 'Atendimento próximo' },
  { icon: BrickWall, label: 'Materiais para sua obra' },
  { icon: MapPin, label: 'Presença em Guariba - SP' },
]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
})

/**
 * Recortes geométricos do cartão de visita: camadas de verde-escuro, branco e
 * vermelho saindo do canto. O SVG preenche a caixa; a posição vem do className.
 */
function CardCorner({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
      className={cn('pointer-events-none absolute', flip && '-scale-y-100', className)}
    >
      <polygon points="200,0 200,200 30,0" className="fill-pine-700" />
      <polygon points="200,0 200,158 76,0" fill="#ffffff" />
      <polygon points="200,0 200,140 96,0" className="fill-brand" />
      <polyline points="64,0 200,124" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
    </svg>
  )
}

/**
 * Assinatura no estilo do cartão (telhado + JANE / MATERIAIS / P/ CONSTRUÇÃO).
 * Recriada a partir da foto do cartão; troque pelo arquivo oficial da logo
 * quando ele estiver disponível.
 */
function CardLockup({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <svg
      role="img"
      aria-label={SITE.name}
      viewBox="0 0 320 196"
      className={cn('h-auto overflow-visible drop-shadow-[0_18px_30px_rgba(0,0,0,0.28)]', className)}
    >
      <m.path
        d="M22 100 V58 L160 12 L298 58 V82"
        fill="none"
        stroke="#ffffff"
        strokeWidth="10"
        strokeLinejoin="miter"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
      />
      <text
        x="160"
        y="102"
        textAnchor="middle"
        textLength="156"
        lengthAdjust="spacingAndGlyphs"
        fontSize="54"
        fontWeight="900"
        className="fill-brand font-sans"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        JANE
      </text>
      <text
        x="160"
        y="152"
        textAnchor="middle"
        textLength="296"
        lengthAdjust="spacingAndGlyphs"
        fontSize="52"
        fontWeight="900"
        fill="#ffffff"
        className="font-sans"
      >
        MATERIAIS
      </text>
      <text
        x="306"
        y="186"
        textAnchor="end"
        textLength="206"
        lengthAdjust="spacingAndGlyphs"
        fontSize="25"
        fontWeight="600"
        fill="#ffffff"
        className="font-sans"
      >
        P/ CONSTRUÇÃO
      </text>
    </svg>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Parallax discreto: os recortes do cartão andam em ritmos diferentes do texto.
  const cornerY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-30%'])
  const cornerYSlow = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-10%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0.15])

  return (
    <section
      ref={ref}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-pine text-bone lg:min-h-[max(100vh,44rem)]"
    >
      {/* Fundo verde do cartão com luz e profundidade sutis */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="animate-glow absolute -left-[20%] -top-[30%] size-[80vmax] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.09),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_20%,transparent_40%,rgba(10,40,28,0.55)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-graphite/50 to-transparent" />
        <div className="grain absolute inset-0 md:mix-blend-soft-light md:opacity-[0.22]" />
      </div>

      {/* Linhas de grade arquitetônicas que "sobem" na entrada */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        <div className="container-x grid h-full grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <m.span
              key={i}
              className="origin-top border-l border-white/[0.07] last:border-r"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.8, ease: EASE, delay: 0.2 + i * 0.08 }}
            />
          ))}
        </div>
      </div>

      {/* Recortes do cartão nas bordas, entrando de fora da tela */}
      <m.div
        aria-hidden="true"
        style={{ y: cornerY }}
        className="absolute right-0 top-(--header-h) -z-10 size-[clamp(7rem,17vw,16rem)]"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
      >
        <CardCorner className="inset-0 size-full" />
      </m.div>
      <m.div
        aria-hidden="true"
        style={{ y: cornerYSlow }}
        className="absolute bottom-[15%] right-0 -z-10 hidden size-[clamp(5rem,9vw,9rem)] lg:block"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
      >
        <CardCorner flip className="inset-0 size-full" />
      </m.div>
      <m.div
        aria-hidden="true"
        className="absolute left-0 top-[46%] -z-10 hidden h-28 w-10 xl:block"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
      >
        <svg viewBox="0 0 40 112" className="size-full" preserveAspectRatio="none">
          <polygon points="0,0 40,56 0,112" fill="#ffffff" />
          <polygon points="0,14 30,56 0,98" className="fill-brand" />
        </svg>
      </m.div>

      {/* Anotação vertical, como numa prancha técnica */}
      <m.p
        {...fadeUp(1.4)}
        className="absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-4 text-[0.62rem] font-medium uppercase tracking-[0.34em] text-steel-200 [writing-mode:vertical-rl] 2xl:flex"
      >
        <span aria-hidden="true" className="h-14 w-px bg-white/60" />
        {SITE.address.street}, {SITE.address.number} · {SITE.address.city} - {SITE.address.state}
      </m.p>

      <m.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative flex flex-1 flex-col justify-end pt-[calc(var(--header-h)+1.5rem)] pb-8 sm:pt-[calc(var(--header-h)+3rem)] sm:pb-10"
      >
        <div className="grid items-center gap-x-10 gap-y-8 lg:grid-cols-12">
          {/* Assinatura do cartão: no topo no celular, à direita no desktop */}
          <m.div
            className="lg:order-2 lg:col-span-5 lg:justify-self-end"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
          >
            <CardLockup className="w-[min(15rem,62vw)] sm:w-[19rem] lg:w-[clamp(20rem,30vw,27rem)]" />
            <p className="mt-4 hidden text-sm font-medium tracking-[0.02em] text-steel-200 sm:block lg:text-right">
              Materiais básicos, acabamentos e ferramentas
            </p>
          </m.div>

          <div className="lg:order-1 lg:col-span-7">
            <m.p {...fadeUp(0.2)} className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 text-steel-200">
              <m.span
                aria-hidden="true"
                className="h-[3px] w-10 origin-left bg-brand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
              />
              <span>
                Materiais para construir. <span className="text-white">Qualidade para durar.</span>
              </span>
            </m.p>

            <RevealLines
              as="h1"
              id="hero-title"
              immediate
              delay={0.35}
              className="mt-6 font-display text-[clamp(2.5rem,6.2vw,5.6rem)] leading-[0.95] text-balance text-white"
              lines={[
                'Tudo para sua obra.',
                <>
                  Confiança em{' '}
                  {/* Destaque como faixa vermelha do cartão (texto branco: contraste AA) */}
                  <em className="accent inline-block -skew-x-6 bg-brand px-[0.18em] pb-[0.06em] text-white">
                    <span className="inline-block skew-x-6">cada etapa.</span>
                  </em>
                </>,
              ]}
            />

            <m.p
              {...fadeUp(0.9)}
              className="mt-7 max-w-[34rem] text-pretty text-[1.05rem] leading-relaxed text-steel-200 sm:text-lg"
            >
              Da fundação ao acabamento, conte com a Jane Materiais para Construção para tirar seus projetos do papel.
            </m.p>

            <m.div {...fadeUp(1.05)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppButton size="lg" />
              <ButtonLink
                href={mapsDirectionsHref()}
                external
                variant="ghost"
                size="lg"
                icon={<Navigation aria-hidden="true" className="size-[1.15rem]" />}
              >
                Como chegar
              </ButtonLink>
            </m.div>
          </div>
        </div>

        {/* Faixa de atributos + indicação de rolagem */}
        <m.div
          {...fadeUp(1.3)}
          className="relative mt-10 flex flex-col gap-6 border-t border-white/15 pt-6 sm:mt-14 md:flex-row md:items-center md:justify-between"
        >
          <ul className="grid grid-cols-3 gap-x-3 sm:gap-x-8 md:flex md:flex-wrap" aria-label="Diferenciais">
            {ATTRIBUTES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex flex-col items-start gap-2 text-[0.78rem] leading-snug text-steel-200 sm:flex-row sm:items-center sm:gap-3 sm:text-sm"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/20 bg-white/[0.06] text-white">
                  <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <a
            href="#loja"
            aria-label="Rolar para conhecer a loja"
            className="absolute -top-5 right-0 grid size-10 place-items-center rounded-full border border-white/20 bg-pine text-white md:hidden"
          >
            <ArrowDown aria-hidden="true" className="animate-bob size-4" />
          </a>

          <a
            href="#loja"
            className="group hidden items-center gap-3 rounded-md text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-steel-200 transition-colors hover:text-white md:inline-flex"
          >
            Role para conhecer
            <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-white/20">
              <span className="animate-scroll-cue absolute inset-x-0 top-0 h-3 bg-brand" />
            </span>
            <ArrowDown aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-y-0.5" />
          </a>
        </m.div>
      </m.div>
    </section>
  )
}
