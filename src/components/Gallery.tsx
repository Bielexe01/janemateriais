import { Suspense, lazy, useRef, useState } from 'react'
import { ExternalLink, Images, Maximize2 } from 'lucide-react'
import { SITE } from '../config/site'
import { ButtonLink } from './ui/Button'
import { IllustrativeBadge, SectionLabel } from './ui/Decor'
import { EASE, Reveal, RevealLines, m } from './ui/motion'

const Lightbox = lazy(() => import('./Lightbox'))

/** Largura aproximada de cada posição da grade, para o navegador baixar o tamanho certo. */
const SLOT_SIZES = [
  '(min-width: 1024px) 56vw, 100vw',
  '(min-width: 1024px) 40vw, 50vw',
  '(min-width: 1024px) 40vw, 50vw',
  '(min-width: 1024px) 24vw, 100vw',
  '(min-width: 1024px) 40vw, 50vw',
  '(min-width: 1024px) 32vw, 50vw',
  '(min-width: 1024px) 40vw, 100vw',
  '(min-width: 1024px) 56vw, 100vw',
]

export function Gallery() {
  const { photos, initialCount, morePhotosUrl } = SITE.gallery
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const [lightboxReady, setLightboxReady] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)

  const visible = expanded ? photos : photos.slice(0, initialCount)
  const hasHidden = photos.length > visible.length
  const hasIllustrative = photos.some((p) => p.illustrative)

  const preloadLightbox = () => void import('./Lightbox')
  const open = (index: number, trigger: HTMLElement) => {
    openerRef.current = trigger
    setLightboxReady(true)
    setActive(index)
  }
  const close = () => {
    setActive(null)
    // Devolve o foco para a foto que abriu o lightbox.
    window.requestAnimationFrame(() => openerRef.current?.focus())
  }

  return (
    <section id="galeria" aria-labelledby="galeria-title" className="on-light bg-bone py-24 text-graphite sm:py-32 lg:py-40">
      <div className="container-x">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="05" label="Galeria" tone="dark" />
            <RevealLines
              id="galeria-title"
              className="mt-7 font-display text-section text-balance"
              lines={[
                <>
                  Conheça <em className="accent text-ember-600">nossa loja.</em>
                </>,
              ]}
            />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="max-w-sm text-pretty text-lg leading-relaxed text-steel-700">
              Um pouco mais de perto da Jane Materiais para Construção.
            </p>
            {hasIllustrative && (
              <p className="mt-4 flex max-w-sm items-start gap-2 text-sm leading-relaxed text-steel-600">
                <Images aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ember-700" />
                Imagens ilustrativas: em breve, fotos reais da loja.
              </p>
            )}
          </Reveal>
        </div>

        <ul className="gallery-grid mt-14 lg:mt-20" onPointerEnter={preloadLightbox} onFocus={preloadLightbox}>
          {visible.map((photo, index) => (
            <m.li
              key={photo.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 1, ease: EASE, delay: (index % 3) * 0.08 }}
            >
              <button
                type="button"
                onClick={(event) => open(index, event.currentTarget)}
                aria-label={`Ampliar foto ${index + 1} de ${photos.length}: ${photo.title}${photo.illustrative ? ' (imagem ilustrativa)' : ''}`}
                className="@container group relative block h-full w-full overflow-hidden rounded-xl bg-bone-300 text-left sm:rounded-2xl"
              >
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes={SLOT_SIZES[index % SLOT_SIZES.length]}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  style={photo.position ? { objectPosition: photo.position } : undefined}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-cine group-hover:scale-[1.045] group-focus-visible:scale-[1.045]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
                {photo.illustrative && <IllustrativeBadge className="absolute left-3 top-3 sm:left-4 sm:top-4" />}
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 grid size-9 scale-90 place-items-center rounded-full bg-bone/90 text-graphite opacity-0 transition-[opacity,scale] duration-500 ease-cine group-hover:scale-100 group-hover:opacity-100 sm:right-4 sm:top-4"
                >
                  <Maximize2 className="size-4" />
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-3 text-bone sm:p-5">
                  <span className="font-display text-[0.7rem] tracking-[0.16em] text-ember">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-semibold leading-tight sm:text-base">{photo.title}</span>
                </span>
              </button>
            </m.li>
          ))}
        </ul>

        {(hasHidden || morePhotosUrl) && (
          <div className="mt-12 flex justify-center">
            {hasHidden ? (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex h-12 items-center gap-2.5 rounded-[0.875rem] border border-graphite/20 px-6 font-semibold transition-colors hover:border-graphite hover:bg-graphite hover:text-bone"
              >
                <Images aria-hidden="true" className="size-4" />
                Ver mais fotos
              </button>
            ) : (
              <ButtonLink href={morePhotosUrl} external variant="outline" icon={<ExternalLink aria-hidden="true" className="size-4" />}>
                Ver mais fotos
              </ButtonLink>
            )}
          </div>
        )}
      </div>

      {lightboxReady && (
        <Suspense fallback={null}>
          <Lightbox photos={photos} index={active} onChange={setActive} onClose={close} />
        </Suspense>
      )}
    </section>
  )
}
