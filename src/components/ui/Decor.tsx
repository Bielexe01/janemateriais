import { cn } from '../../lib/cn'
import { Reveal } from './motion'

interface SectionLabelProps {
  index: string
  label: string
  tone?: 'light' | 'dark'
  className?: string
}

/** "01 — A loja": numeração editorial usada em todas as seções. */
export function SectionLabel({ index, label, tone = 'light', className }: SectionLabelProps) {
  return (
    <Reveal className={cn('eyebrow flex items-center gap-4', className)} y={14}>
      <span className={cn('font-display tracking-[0.12em]', tone === 'light' ? 'text-ember' : 'text-ember-700')}>
        {index}
      </span>
      <span aria-hidden="true" className={cn('h-px w-10', tone === 'light' ? 'bg-white/25' : 'bg-graphite/25')} />
      <span className={tone === 'light' ? 'text-steel-300' : 'text-steel-600'}>{label}</span>
    </Reveal>
  )
}

/** Marcas de corte nos cantos, como em prancha técnica. */
export function CornerMarks({ className, size = 'size-4' }: { className?: string; size?: string }) {
  const corner = cn('absolute border-ember', size)
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-3 sm:inset-4', className)}>
      <span className={cn(corner, 'left-0 top-0 border-l border-t')} />
      <span className={cn(corner, 'right-0 top-0 border-r border-t')} />
      <span className={cn(corner, 'bottom-0 left-0 border-b border-l')} />
      <span className={cn(corner, 'bottom-0 right-0 border-b border-r')} />
    </span>
  )
}

/**
 * Selo para fotos provisórias, para não parecerem fotos reais da loja.
 * Dentro de um container estreito (miniaturas de 2 colunas no celular) o selo
 * encurta para "Ilustrativa" em vez de quebrar em duas linhas.
 */
export function IllustrativeBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-graphite/70 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-bone/90 backdrop-blur-sm',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
      <span>
        <span className="@max-[14rem]:hidden">Imagem </span>ilustrativa
      </span>
    </span>
  )
}
