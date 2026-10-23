import { SITE } from '../config/site'
import { cn } from '../lib/cn'

/**
 * Usa a logo oficial definida em SITE.logo. Enquanto ela não existir, mostra um
 * logotipo em texto neutro (provisório), sem criar um símbolo novo para a marca.
 */
export function Logo({ className }: { className?: string }) {
  if (SITE.logo) {
    return (
      <img
        src={SITE.logo.src}
        width={SITE.logo.width}
        height={SITE.logo.height}
        alt={SITE.name}
        className={cn('h-9 w-auto sm:h-10', className)}
      />
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-3 leading-none', className)}>
      <span className="font-display text-[1.7rem] tracking-[-0.045em] sm:text-[1.9rem]">Jane</span>
      <span aria-hidden="true" className="h-7 w-px bg-current opacity-25" />
      <span className="text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.2em] opacity-75 sm:text-[0.6rem]">
        Materiais para
        <br />
        Construção
      </span>
    </span>
  )
}
