import { useRef } from 'react'
import { SITE } from '../config/site'
import { CornerMarks, IllustrativeBadge, SectionLabel } from './ui/Decor'
import { EASE, Reveal, RevealLines, VIEWPORT, m, useParallax } from './ui/motion'

const PRINCIPLES = [
  {
    title: 'Atendimento atencioso',
    text: 'Quem constrói ou reforma precisa de orientação clara. Um atendimento próximo ajuda a escolher com mais segurança.',
  },
  {
    title: 'Experiência simples',
    text: 'Encontrar o que você precisa deve ser prático, para que a obra siga no ritmo certo.',
  },
  {
    title: 'Da fundação ao acabamento',
    text: 'Um ponto de apoio em Guariba para acompanhar cada etapa do seu projeto.',
  },
]

export function About() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const mainY = useParallax(mediaRef, 36)
  const detailY = useParallax(mediaRef, -28)
  const { store, storeDetail } = SITE.images

  return (
    <section id="loja" aria-labelledby="loja-title" className="on-light relative overflow-hidden bg-bone py-24 text-graphite sm:py-32 lg:py-40">
      {/* Grade técnica muito leve no fundo */}
      <div aria-hidden="true" className="blueprint pointer-events-none absolute inset-0 text-graphite/[0.035]" />

      <div className="container-x relative grid gap-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:pt-6">
          <SectionLabel index="01" label="A loja" tone="dark" />
          <RevealLines
            id="loja-title"
            className="mt-7 font-display text-section text-balance"
            lines={[
              'Sua obra merece',
              <>
                começar <em className="accent text-ember-600">bem.</em>
              </>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[36rem] text-pretty text-lg leading-relaxed text-steel-700 sm:text-xl sm:leading-relaxed">
              Na Jane Materiais para Construção, você encontra um ponto de apoio para realizar seus projetos, com
              atendimento próximo e praticidade para encontrar o que precisa para sua obra.
            </p>
          </Reveal>

          <m.ol
            className="mt-14 max-w-[36rem] border-t border-graphite/10"
            initial="hidden"
            whileInView="shown"
            viewport={VIEWPORT}
            variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.12 } } }}
          >
            {PRINCIPLES.map((item, i) => (
              <m.li
                key={item.title}
                variants={{ hidden: { opacity: 0, y: 18 }, shown: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.85, ease: EASE }}
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-graphite/10 py-6 sm:grid-cols-[4rem_1fr]"
              >
                <span className="font-display text-sm text-ember-700">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl tracking-[-0.025em] sm:text-[1.35rem]">{item.title}</h3>
                  <p className="mt-2 text-pretty leading-relaxed text-steel-600">{item.text}</p>
                </div>
              </m.li>
            ))}
          </m.ol>
        </div>

        {/* Composição fotográfica assimétrica */}
        <div ref={mediaRef} className="relative mx-auto w-full max-w-[34rem] pb-16 lg:col-span-5 lg:col-start-8 lg:max-w-none lg:pb-24">
          <Reveal y={40}>
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bone-300">
                <m.img
                  style={{ y: mainY }}
                  src={store.src}
                  srcSet={store.srcSet}
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 34rem, 92vw"
                  width={store.width}
                  height={store.height}
                  alt={store.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-[112%] w-full -translate-y-[6%] object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-graphite/45 via-transparent to-transparent" />
                <CornerMarks className="opacity-80" />
                {store.illustrative && <IllustrativeBadge className="absolute bottom-4 right-4" />}
              </div>
            </figure>
          </Reveal>

          <m.figure
            style={{ y: detailY }}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            className="absolute bottom-0 left-[-6%] w-[48%] sm:left-[-10%] lg:left-[-22%] lg:w-[52%]"
          >
            <div className="aspect-square overflow-hidden rounded-xl border-[6px] border-bone bg-bone-300 shadow-[0_30px_60px_-30px_rgba(23,25,27,0.55)]">
              <img
                src={storeDetail.src}
                srcSet={storeDetail.srcSet}
                sizes="(min-width: 1024px) 20vw, 46vw"
                width={storeDetail.width}
                height={storeDetail.height}
                alt={storeDetail.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </m.figure>

          {/* Cota técnica: da fundação ao acabamento (sempre fora da foto) */}
          <div aria-hidden="true" className="absolute -right-10 top-0 bottom-24 hidden w-6 flex-col items-center sm:flex lg:bottom-32">
            <span className="h-2 w-px bg-graphite/40" />
            <span className="h-px w-3 bg-graphite/40" />
            <span className="w-px flex-1 bg-graphite/25" />
            <span className="my-3 text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-steel-600 [writing-mode:vertical-rl]">
              Da fundação ao acabamento
            </span>
            <span className="w-px flex-1 bg-graphite/25" />
            <span className="h-px w-3 bg-graphite/40" />
            <span className="h-2 w-px bg-graphite/40" />
          </div>
        </div>
      </div>
    </section>
  )
}
