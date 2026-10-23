import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryPhoto } from '../config/types'
import { cn } from '../lib/cn'
import { IllustrativeBadge } from './ui/Decor'
import { EASE, m } from './ui/motion'

interface LightboxProps {
  photos: GalleryPhoto[]
  index: number | null
  onChange: (index: number) => void
  onClose: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir === 0 ? 0 : dir > 0 ? 70 : -70, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir === 0 ? 0 : dir > 0 ? -70 : 70, scale: 0.985 }),
}

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

export default function Lightbox({ photos, index, onChange, onClose }: LightboxProps) {
  const open = index !== null
  const total = photos.length
  const [direction, setDirection] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const pointerX = useRef<number | null>(null)

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      setDirection(delta)
      onChange((index + delta + total) % total)
    },
    [index, onChange, total],
  )

  const jump = (target: number) => {
    if (index === null || target === index) return
    setDirection(target > index ? 1 : -1)
    onChange(target)
  }

  // Trava a rolagem da página (sem "pulo" da barra de rolagem) e foca o botão fechar.
  useEffect(() => {
    if (!open) return
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    closeRef.current?.focus()
    return () => {
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
    }
  }, [open])

  // Teclado: Esc fecha, setas navegam, Tab fica preso dentro do diálogo.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowRight') {
        go(1)
      } else if (event.key === 'ArrowLeft') {
        go(-1)
      } else if (event.key === 'Tab' && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, go, onClose])

  // Pré-carrega as fotos vizinhas e mantém a miniatura ativa visível.
  useEffect(() => {
    if (index === null) return
    for (const delta of [1, -1]) {
      const photo = photos[(index + delta + total) % total]
      const img = new Image()
      img.sizes = '100vw'
      if (photo.srcSet) img.srcset = photo.srcSet
      img.src = photo.src
    }
    thumbsRef.current
      ?.querySelector<HTMLElement>(`[data-thumb="${index}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [index, photos, total])

  const onPointerDown = (event: ReactPointerEvent) => {
    pointerX.current = event.clientX
  }
  const onPointerUp = (event: ReactPointerEvent) => {
    const start = pointerX.current
    pointerX.current = null
    if (start === null) return
    const dx = event.clientX - start
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1)
  }

  const photo = index !== null ? photos[index] : null

  return createPortal(
    <AnimatePresence>
      {open && photo && (
        <m.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos da loja"
          className="fixed inset-0 z-[90] flex flex-col bg-graphite-950 text-bone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="container-x flex h-(--header-h) shrink-0 items-center justify-between gap-4">
            <p className="font-display text-sm tracking-[0.18em] text-steel-300" aria-live="polite">
              <span className="sr-only">Foto </span>
              <span className="text-ember">{pad(index! + 1)}</span> / {pad(total)}
              <span className="sr-only">: {photo.title}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar galeria"
              className="grid size-11 place-items-center rounded-xl border border-white/15 transition-colors hover:border-white/50"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1 touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <AnimatePresence initial={false} custom={direction}>
              <m.img
                key={photo.src}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: EASE }}
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="100vw"
                alt={photo.alt}
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain px-3 sm:px-24"
              />
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-graphite/70 backdrop-blur transition-colors hover:border-ember hover:text-ember sm:left-6"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Próxima foto"
                  className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-graphite/70 backdrop-blur transition-colors hover:border-ember hover:text-ember sm:right-6"
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </>
            )}
          </div>

          <div className="container-x shrink-0 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-display text-lg tracking-[-0.02em]">{photo.title}</p>
              {photo.illustrative && <IllustrativeBadge />}
            </div>
            <div ref={thumbsRef} className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
              {photos.map((thumb, i) => (
                <button
                  key={thumb.src}
                  type="button"
                  data-thumb={i}
                  onClick={() => jump(i)}
                  aria-label={`Ver foto ${i + 1}: ${thumb.title}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={cn(
                    'relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-[opacity,box-shadow] duration-300 sm:h-16 sm:w-24',
                    i === index ? 'opacity-100 ring-2 ring-ember' : 'opacity-45 hover:opacity-80',
                  )}
                >
                  <img
                    src={thumb.srcSet ? thumb.srcSet.split(',')[0].trim().split(' ')[0] : thumb.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
