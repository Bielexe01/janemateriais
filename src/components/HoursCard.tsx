import { useId, useState } from 'react'
import { ChevronDown, Clock } from 'lucide-react'
import { SITE } from '../config/site'
import { useNow } from '../hooks/useNow'
import { cn } from '../lib/cn'
import {
  WEEKDAY_LABEL,
  WEEK_ORDER,
  describeNextOpening,
  formatClock,
  formatDayHours,
  getStoreStatus,
  isScheduleConfigured,
  todayKey,
  type StoreStatus,
} from '../lib/hours'
import { whatsappHref } from '../lib/links'
import { EASE, m } from './ui/motion'

const STATUS_STYLE = {
  open: { label: 'Aberta agora', dot: 'bg-open', ring: 'border-open/35 text-open' },
  closed: { label: 'Fechada agora', dot: 'bg-closed', ring: 'border-closed/35 text-closed' },
  unknown: { label: 'Horário a confirmar', dot: 'bg-ember', ring: 'border-ember/40 text-ember' },
} as const

function statusDetail(status: StoreStatus): string {
  if (status.state === 'open') {
    return status.closingSoon ? `Fecha em breve, às ${status.closesAt}` : `Fecha hoje às ${status.closesAt}`
  }
  if (status.state === 'closed') {
    return status.next ? describeNextOpening(status.next) : 'Consulte os horários de funcionamento abaixo.'
  }
  return 'Entre em contato para confirmar o horário de funcionamento antes da sua visita.'
}

export function HoursCard() {
  const now = useNow()
  const [open, setOpen] = useState(false)
  const listId = useId()
  const { timeZone, week } = SITE.hours
  const configured = isScheduleConfigured(week)
  const status = getStoreStatus(week, timeZone, now)
  const style = STATUS_STYLE[status.state]
  const today = todayKey(timeZone, now)

  return (
    <article
      id="horario"
      data-anchor
      aria-labelledby="horario-title"
      className="relative overflow-hidden rounded-2xl bg-graphite p-6 text-bone shadow-[0_40px_80px_-50px_rgba(23,25,27,0.8)] sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ember">
            <Clock aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </span>
          <h3 id="horario-title" className="font-display text-xl tracking-[-0.025em] sm:text-2xl">
            Horário de funcionamento
          </h3>
        </div>
        <p
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]',
            style.ring,
          )}
        >
          <span aria-hidden="true" className="relative flex size-2">
            {status.state === 'open' && (
              <span className={cn('animate-ping-soft absolute inset-0 rounded-full', style.dot)} />
            )}
            <span className={cn('relative size-2 rounded-full', style.dot)} />
          </span>
          {style.label}
        </p>
      </div>

      <div aria-live="polite" className="mt-6">
        <p className="text-pretty text-steel-200">{statusDetail(status)}</p>
        {!configured && (
          <a
            href={whatsappHref(undefined, 'Olá! Gostaria de confirmar o horário de funcionamento da loja.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ember underline-offset-4 hover:underline"
          >
            Confirmar pelo WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        )}
      </div>

      <p className="mt-4 text-xs text-steel-400">
        Agora em Guariba: <time dateTime={now.toISOString()}>{formatClock(now, timeZone)}</time>
      </p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={listId}
        className="mt-6 flex min-h-12 w-full items-center justify-between gap-4 border-t border-white/10 pt-5 text-left text-sm font-semibold text-bone transition-colors hover:text-ember"
      >
        {open ? 'Ocultar horários' : 'Ver todos os horários'}
        <ChevronDown
          aria-hidden="true"
          className={cn('size-5 transition-transform duration-500 ease-cine', open && 'rotate-180')}
        />
      </button>

      <m.div
        id={listId}
        inert={!open}
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="overflow-hidden"
      >
        <ul className="pt-3">
          {WEEK_ORDER.map((day) => {
            const isToday = day === today
            return (
              <li
                key={day}
                className={cn(
                  'flex items-center justify-between gap-4 border-b border-white/[0.06] py-3 text-sm last:border-0',
                  isToday ? 'text-bone' : 'text-steel-300',
                )}
              >
                <span className="flex items-center gap-2.5">
                  {WEEKDAY_LABEL[day]}
                  {isToday && (
                    <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ember">
                      Hoje
                    </span>
                  )}
                </span>
                <span className="tabular-nums">{formatDayHours(week[day])}</span>
              </li>
            )
          })}
        </ul>
        {!configured && (
          <p className="mt-3 rounded-lg bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-steel-300">
            Os horários de funcionamento ainda serão informados. Entre em contato para confirmar antes da sua visita.
          </p>
        )}
      </m.div>
    </article>
  )
}
