import { useRef } from 'react'
import { Phone } from 'lucide-react'
import { SITE } from '../config/site'
import { formatBRPhone, telHref } from '../lib/links'
import { ArrowLink, WhatsAppButton } from './ui/Button'
import { CornerMarks, IllustrativeBadge, SectionLabel } from './ui/Decor'
import { EASE, Reveal, RevealLines, VIEWPORT, m, useParallax } from './ui/motion'

export function ContactCta() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const imageY = useParallax(mediaRef, 50)
  const { contact } = SITE.images
  const phoneHref = telHref(SITE.contact.phone)

  return (
    <section id="contato" aria-labelledby="contato-title" className="relative isolate overflow-hidden bg-graphite text-bone">
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
      {/* Linha de nível a laser, desenhada ao entrar na tela. Fica na faixa
          livre abaixo do conteúdo (lg:py-32), para nunca cruzar o título. */}
      <m.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-16 -z-10 hidden h-px origin-left bg-gradient-to-r from-ember/0 via-ember/60 to-ember/0 lg:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.8, ease: EASE }}
      />

      <div className="grid lg:min-h-[44rem] lg:grid-cols-12">
        {/* Foto */}
        <div ref={mediaRef} className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/9] lg:order-2 lg:col-span-5 lg:aspect-auto">
          <m.img
            style={{ y: imageY }}
            src={contact.src}
            srcSet={contact.srcSet}
            sizes="(min-width: 1024px) 42vw, 100vw"
            width={contact.width}
            height={contact.height}
            alt={contact.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-[118%] w-full -translate-y-[8%] object-cover object-[35%_78%] [filter:saturate(0.55)_sepia(0.2)_contrast(1.06)_brightness(0.9)]"
          />
          {/* Tratamento de cor: céu azul saturado vira tom grafite, alinhado à paleta. */}
          <div aria-hidden="true" className="absolute inset-0 bg-graphite/20 mix-blend-multiply" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-graphite/55 via-graphite/0 to-graphite/0" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/10 to-graphite/30 lg:bg-gradient-to-r lg:from-graphite lg:via-graphite/20 lg:to-transparent" />
          <CornerMarks className="inset-5 sm:inset-6" />
          {contact.illustrative && <IllustrativeBadge className="absolute right-6 top-6 sm:right-8 sm:top-8" />}
        </div>

        {/* Texto + conversão */}
        <div className="container-x relative py-20 sm:py-28 lg:order-1 lg:col-span-7 lg:mr-0 lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:py-32 lg:pr-12">
          <div className="lg:ml-auto lg:w-full lg:max-w-[46rem]">
            <SectionLabel index="02" label="Contato" />
            <RevealLines
              id="contato-title"
              className="mt-7 font-display text-section text-balance"
              lines={['Vai construir', 'ou reformar?', <em className="accent text-ember">Vamos conversar.</em>]}
            />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[30rem] text-pretty text-lg leading-relaxed text-steel-200 sm:text-xl sm:leading-relaxed">
                Entre em contato com nossa equipe e saiba como chegar à Jane Materiais para Construção.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <WhatsAppButton size="lg">Pedir pelo WhatsApp</WhatsAppButton>
              <ArrowLink href="#localizacao">Ver como chegar</ArrowLink>
            </Reveal>
            {phoneHref && (
              <Reveal delay={0.3}>
                <p className="mt-8 flex items-center gap-3 text-steel-300">
                  <Phone aria-hidden="true" className="size-4 text-ember" />
                  Prefere ligar?
                  <a href={phoneHref} className="font-semibold text-bone underline-offset-4 hover:underline">
                    {formatBRPhone(SITE.contact.phone)}
                  </a>
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
