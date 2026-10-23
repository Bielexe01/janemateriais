import { MessageSquareQuote, Star } from 'lucide-react'
import { SITE } from '../config/site'
import type { Review } from '../config/types'
import { cn } from '../lib/cn'
import { reviewsHref } from '../lib/links'
import { ArrowLink } from './ui/Button'
import { SectionLabel } from './ui/Decor'
import { EASE, Reveal, RevealLines, VIEWPORT, m } from './ui/motion'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

/** Estrelas só aparecem quando a nota estiver confirmada no site.ts. */
function Stars({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <p className="flex items-center gap-1" aria-label={`Nota ${value} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn('size-4', i < value ? 'fill-ember text-ember' : 'text-white/25')}
        />
      ))}
    </p>
  )
}

function ReviewCard({ review, featured }: { review: Review; featured: boolean }) {
  return (
    <m.figure
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-graphite/45',
        featured ? 'p-7 sm:p-12 lg:p-16' : 'p-7 sm:p-9',
      )}
    >
      {/* Aspas gigantes, decorativas. SVG em vez do glifo da fonte: o glifo
          depende das métricas da fonte e acabava cortado pela borda do card. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 64 48"
        fill="currentColor"
        className="pointer-events-none absolute right-6 top-6 w-16 text-white/[0.09] sm:right-10 sm:top-10 sm:w-28 lg:right-14 lg:top-12 lg:w-36"
      >
        <path d="M26 4C14 8 4 18 4 32c0 8 5 14 12 14s12-5 12-12-5-12-12-12c-1.5 0-3 .3-4 .8C13.5 15 19 9.5 28 7z" />
        <path d="M26 4C14 8 4 18 4 32c0 8 5 14 12 14s12-5 12-12-5-12-12-12c-1.5 0-3 .3-4 .8C13.5 15 19 9.5 28 7z" transform="translate(32 0)" />
      </svg>

      <div className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-steel-300">
        <MessageSquareQuote aria-hidden="true" className="size-4 text-ember" strokeWidth={1.75} />
        Avaliação de cliente
      </div>

      {review.rating !== null && (
        <div className="mt-5">
          <Stars rating={review.rating} />
        </div>
      )}

      <blockquote className="relative mt-8">
        <p
          className={cn(
            'text-balance font-serif italic leading-[1.06] tracking-[-0.01em] text-bone',
            featured ? 'text-[clamp(2.1rem,4.8vw,4.4rem)]' : 'text-3xl',
          )}
        >
          “{review.text}”
        </p>
      </blockquote>

      <figcaption className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6 sm:mt-14">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-brand font-display text-sm tracking-[0.02em] text-white"
        >
          {initials(review.author)}
        </span>
        <span>
          <cite className="block font-display text-lg not-italic tracking-[-0.02em] text-bone">{review.author}</cite>
          <span className="text-sm text-steel-300">{review.when}</span>
        </span>
      </figcaption>
    </m.figure>
  )
}

export function Reviews() {
  const { items } = SITE.reviews
  if (!items.length) return null
  const featured = items.length === 1

  return (
    <section
      id="avaliacoes"
      aria-labelledby="avaliacoes-title"
      className="relative overflow-hidden bg-chumbo py-24 text-bone sm:py-32 lg:py-40"
    >
      <div aria-hidden="true" className="blueprint pointer-events-none absolute inset-0 text-white/[0.025]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionLabel index="04" label="Avaliações" />
          <RevealLines
            id="avaliacoes-title"
            className="mt-7 font-display text-section text-balance"
            lines={['Quem compra,', <em className="accent text-ember">recomenda.</em>]}
          />
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xs text-pretty leading-relaxed text-steel-300">
              A opinião de quem já passou pela loja.
            </p>
            <ArrowLink href={reviewsHref()} external className="mt-8">
              Ver mais comentários
            </ArrowLink>
          </Reveal>
        </div>

        <div className={cn('lg:col-span-8', !featured && 'grid gap-6 md:grid-cols-2')}>
          {items.map((review) => (
            <ReviewCard key={`${review.author}-${review.when}`} review={review} featured={featured} />
          ))}
        </div>
      </div>
    </section>
  )
}
