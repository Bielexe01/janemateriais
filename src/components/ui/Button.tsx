import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { whatsappHref } from '../../lib/links'
import { WhatsAppIcon } from './WhatsAppIcon'

type Variant = 'primary' | 'ghost' | 'outline' | 'light'
type Size = 'sm' | 'md' | 'lg'

const BASE =
  'group/btn relative isolate inline-flex select-none items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-[0.875rem] font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-cine active:scale-[0.98]'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-[0_14px_34px_-16px_rgba(217,37,43,0.85)] hover:bg-brand-600 hover:shadow-[0_20px_44px_-18px_rgba(217,37,43,0.95)]',
  ghost: 'border border-white/20 bg-white/[0.04] text-bone hover:border-white/55 hover:bg-white/[0.09]',
  outline: 'border border-graphite/20 text-graphite hover:border-graphite hover:bg-graphite hover:text-bone',
  light: 'bg-bone text-graphite hover:bg-white',
}

const SIZES: Record<Size, string> = {
  sm: 'h-11 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-7 text-base sm:h-[3.75rem] sm:px-8 sm:text-[1.05rem]',
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: Variant
  size?: Size
  icon?: ReactNode
  trailing?: ReactNode
  /** Abre em nova aba (links para WhatsApp e Google Maps). */
  external?: boolean
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  trailing,
  external,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.42)_50%,transparent_70%)] transition-transform duration-700 ease-cine group-hover/btn:translate-x-[120%]"
        />
      )}
      {icon}
      <span>{children}</span>
      {trailing}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  )
}

interface WhatsAppButtonProps extends Omit<ButtonLinkProps, 'href' | 'icon' | 'external'> {
  message?: string
}

/** Botão principal de conversão: abre a conversa no WhatsApp da loja. */
export function WhatsAppButton({ message, children = 'Fale pelo WhatsApp', ...rest }: WhatsAppButtonProps) {
  return (
    <ButtonLink
      href={whatsappHref(undefined, message)}
      external
      icon={
        <WhatsAppIcon className="size-5 shrink-0 transition-transform duration-500 ease-spring group-hover/btn:-rotate-12 group-hover/btn:scale-115" />
      }
      {...rest}
    >
      {children}
    </ButtonLink>
  )
}

interface ArrowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  external?: boolean
  tone?: 'light' | 'dark'
}

/** Link de texto com seta que desliza no hover. */
export function ArrowLink({ href, external, tone = 'light', className, children, ...rest }: ArrowLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group/link inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-[6px] transition-colors duration-300',
        tone === 'light' ? 'text-bone hover:text-ember' : 'text-graphite hover:text-ember-700',
        className,
      )}
      {...rest}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-cine group-hover/link:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-300 ease-cine group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
      />
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  )
}
