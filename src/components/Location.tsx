import { useState } from 'react'
import { Check, Copy, ExternalLink, MapPin, Navigation } from 'lucide-react'
import { SITE } from '../config/site'
import { addressLines, fullAddress, mapsDirectionsHref, mapsEmbedSrc, mapsPlaceHref } from '../lib/links'
import { HoursCard } from './HoursCard'
import { ButtonLink } from './ui/Button'
import { SectionLabel } from './ui/Decor'
import { EASE, Reveal, RevealLines, VIEWPORT, m } from './ui/motion'

function CopyAddress() {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${SITE.name} - ${fullAddress()}`)
      setState('copied')
    } catch {
      setState('error')
    }
    window.setTimeout(() => setState('idle'), 2400)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-steel-600 transition-colors hover:text-graphite"
    >
      {state === 'copied' ? (
        <Check aria-hidden="true" className="size-4 text-ember-700" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
      <span aria-live="polite">
        {state === 'copied' ? 'Endereço copiado' : state === 'error' ? 'Não foi possível copiar' : 'Copiar endereço'}
      </span>
    </button>
  )
}

export function Location() {
  return (
    <section
      id="localizacao"
      aria-labelledby="localizacao-title"
      className="on-light relative overflow-hidden bg-bone py-24 text-graphite sm:py-32 lg:py-40"
    >
      {/* Número da loja como elemento gráfico */}
      <m.span
        aria-hidden="true"
        className="outline-text pointer-events-none absolute -right-[4%] top-6 select-none font-display text-[clamp(10rem,30vw,28rem)] leading-none text-graphite/[0.09] sm:top-10"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.6, ease: EASE }}
      >
        {SITE.address.number}
      </m.span>

      <div className="container-x relative">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="03" label="Localização" tone="dark" />
            <RevealLines
              id="localizacao-title"
              className="mt-7 font-display text-section text-balance"
              lines={[
                'Estamos perto',
                <>
                  de <em className="accent text-ember-600">você.</em>
                </>,
              ]}
            />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="max-w-sm text-pretty text-lg leading-relaxed text-steel-700">
              Venha até a loja ou trace sua rota direto pelo Google Maps.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-6">
            <Reveal>
              <article
                aria-label="Endereço da loja"
                className="rounded-2xl border border-graphite/10 bg-white/70 p-6 shadow-[0_30px_60px_-45px_rgba(23,25,27,0.6)] sm:p-8"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-white">
                    <MapPin aria-hidden="true" className="size-5" strokeWidth={2} />
                  </span>
                  <address className="not-italic">
                    <p className="font-display text-xl tracking-[-0.025em] sm:text-2xl">{SITE.name}</p>
                    <p className="mt-2 text-steel-700">{addressLines.street}</p>
                    <p className="text-steel-700">{addressLines.city}</p>
                  </address>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <ButtonLink
                    href={mapsDirectionsHref()}
                    external
                    icon={<Navigation aria-hidden="true" className="size-4" />}
                  >
                    Ver rota até a loja
                  </ButtonLink>
                  <ButtonLink
                    href={mapsPlaceHref()}
                    external
                    variant="outline"
                    icon={<ExternalLink aria-hidden="true" className="size-4" />}
                  >
                    Abrir no Google Maps
                  </ButtonLink>
                </div>
                <div className="mt-4 border-t border-graphite/10 pt-3">
                  <CopyAddress />
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <HoursCard />
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.15} y={40}>
            <div className="relative h-[24rem] overflow-hidden rounded-2xl border border-graphite/10 bg-bone-200 sm:h-[30rem] lg:h-full lg:min-h-[36rem]">
              <div aria-hidden="true" className="blueprint absolute inset-0 text-graphite/[0.06]" />
              <p className="absolute inset-0 grid place-items-center text-sm text-steel-600">Carregando mapa…</p>
              <iframe
                title={`Mapa com a localização da ${SITE.name}`}
                src={mapsEmbedSrc()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.8)_contrast(1.04)]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
