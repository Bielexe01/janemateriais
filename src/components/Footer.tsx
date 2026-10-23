import { ArrowUp, Clock, MapPin, Phone } from 'lucide-react'
import { NAV_ITEMS } from '../config/nav'
import { SITE } from '../config/site'
import { addressLines, formatBRPhone, mapsPlaceHref, telHref, whatsappHref } from '../lib/links'
import { Logo } from './Logo'
import { WhatsAppButton } from './ui/Button'
import { WhatsAppIcon } from './ui/WhatsAppIcon'

const linkClass =
  'inline-flex min-h-10 items-center gap-2.5 text-steel-300 transition-colors duration-300 hover:text-bone'

export function Footer() {
  const year = new Date().getFullYear()
  const phoneHref = telHref(SITE.contact.phone)

  return (
    <footer className="relative overflow-hidden bg-graphite text-bone">
      <div className="container-x relative pt-20 pb-8 sm:pt-28">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <a href="#inicio" className="inline-block rounded-md" aria-label={`${SITE.name}: voltar ao início`}>
              <Logo />
            </a>
            <p className="mt-6 max-w-xs text-pretty leading-relaxed text-steel-300">
              Materiais para construir. Qualidade para durar.
            </p>
            <WhatsAppButton size="md" className="mt-8" />
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-steel-400">Endereço</h2>
            <address className="mt-5 not-italic leading-relaxed text-steel-200">
              {SITE.name}
              <br />
              {addressLines.street}
              <br />
              {addressLines.city}
            </address>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-steel-400">Contato</h2>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <WhatsAppIcon className="size-4 text-ember" />
                  WhatsApp<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={mapsPlaceHref()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <MapPin aria-hidden="true" className="size-4 text-ember" />
                  Google Maps<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href="#horario" className={linkClass}>
                  <Clock aria-hidden="true" className="size-4 text-ember" />
                  Horário de funcionamento
                </a>
              </li>
              {phoneHref && (
                <li>
                  <a href={phoneHref} className={linkClass}>
                    <Phone aria-hidden="true" className="size-4 text-ember" />
                    {formatBRPhone(SITE.contact.phone)}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-3">
            <h2 className="eyebrow text-steel-400">Navegação</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Assinatura tipográfica gigante */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-20 select-none font-display text-[clamp(5rem,22vw,20rem)] leading-[0.78] tracking-[-0.06em] text-white/[0.04]"
        >
          Jane
        </p>

        <div className="mt-2 flex flex-col gap-5 border-t border-white/10 pt-7 text-sm text-steel-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center justify-between gap-8">
            <p>
              Desenvolvido por{' '}
              {SITE.credits.url ? (
                <a
                  href={SITE.credits.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-steel-200 transition-colors hover:text-ember"
                >
                  {SITE.credits.name}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              ) : (
                <span className="font-semibold text-steel-200">{SITE.credits.name}</span>
              )}
            </p>
            <a href="#inicio" className="group inline-flex min-h-10 items-center gap-2 text-steel-300 hover:text-bone">
              Voltar ao topo
              <ArrowUp aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
