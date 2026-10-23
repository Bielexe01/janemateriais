import type { DayHours, Weekday } from '../config/types.ts'

export const WEEK_ORDER: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

/** Mesma ordem de Date.getDay(): 0 = domingo. */
const JS_ORDER: Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
}

const WEEKDAY_WITH_PREPOSITION: Record<Weekday, string> = {
  monday: 'na segunda-feira',
  tuesday: 'na terça-feira',
  wednesday: 'na quarta-feira',
  thursday: 'na quinta-feira',
  friday: 'na sexta-feira',
  saturday: 'no sábado',
  sunday: 'no domingo',
}

export const SCHEMA_DAY: Record<Weekday, string> = {
  monday: 'https://schema.org/Monday',
  tuesday: 'https://schema.org/Tuesday',
  wednesday: 'https://schema.org/Wednesday',
  thursday: 'https://schema.org/Thursday',
  friday: 'https://schema.org/Friday',
  saturday: 'https://schema.org/Saturday',
  sunday: 'https://schema.org/Sunday',
}

export interface Interval {
  start: number
  end: number
  open: string
  close: string
}

/** "7:30" -> 450 minutos. Retorna null quando o formato é inválido. */
export function parseTime(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (m > 59 || h > 24 || (h === 24 && m > 0)) return null
  return h * 60 + m
}

const pad = (n: number) => String(n).padStart(2, '0')
export const formatMinutes = (total: number) => `${pad(Math.floor(total / 60))}:${pad(total % 60)}`

/**
 * Converte o horário de um dia em intervalos válidos.
 * null  -> dia sem informação (nunca vira "aberto" nem "fechado").
 * []    -> fechado o dia todo.
 */
export function toIntervals(day: DayHours | undefined): Interval[] | null {
  if (day === null || day === undefined) return null
  if (day === 'closed') return []
  const list: Interval[] = []
  for (const range of day) {
    const start = parseTime(range.open)
    const end = parseTime(range.close)
    if (start === null || end === null || end <= start) continue
    list.push({ start, end, open: formatMinutes(start), close: formatMinutes(end) })
  }
  // Faixas todas inválidas: tratamos como "não informado" para não afirmar que está fechada.
  if (list.length === 0) return null
  return list.sort((a, b) => a.start - b.start)
}

export function isScheduleConfigured(week: Record<Weekday, DayHours>): boolean {
  return WEEK_ORDER.some((day) => toIntervals(week[day]) !== null)
}

export function isScheduleComplete(week: Record<Weekday, DayHours>): boolean {
  return WEEK_ORDER.every((day) => toIntervals(week[day]) !== null)
}

/** Dia da semana e minutos do dia no fuso informado (ex.: America/Sao_Paulo). */
export function zonedNow(date: Date, timeZone: string): { day: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ''
  const index = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const day = JS_ORDER[index >= 0 ? index : date.getDay()]
  const minutes = (Number(get('hour')) % 24) * 60 + Number(get('minute'))
  return { day, minutes }
}

export function formatClock(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' }).format(date)
}

export interface NextOpening {
  day: Weekday
  dayOffset: number
  time: string
}

export type StoreStatus =
  | { state: 'unknown' }
  | { state: 'open'; closesAt: string; closingSoon: boolean }
  | { state: 'closed'; next: NextOpening | null }

/**
 * Calcula se a loja está aberta agora. Só responde "aberta" ou "fechada" quando
 * existe regra cadastrada para o dia; sem regra, o status é "unknown".
 */
export function getStoreStatus(
  week: Record<Weekday, DayHours>,
  timeZone: string,
  date: Date = new Date(),
): StoreStatus {
  const { day, minutes } = zonedNow(date, timeZone)
  const today = toIntervals(week[day])
  if (today === null) return { state: 'unknown' }

  const current = today.find((i) => minutes >= i.start && minutes < i.end)
  if (current) {
    return { state: 'open', closesAt: current.close, closingSoon: current.end - minutes <= 60 }
  }

  const laterToday = today.find((i) => i.start > minutes)
  if (laterToday) return { state: 'closed', next: { day, dayOffset: 0, time: laterToday.open } }

  const todayIndex = JS_ORDER.indexOf(day)
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = JS_ORDER[(todayIndex + offset) % 7]
    const intervals = toIntervals(week[nextDay])
    // Um dia sem informação no caminho impede prever a próxima abertura.
    if (intervals === null) return { state: 'closed', next: null }
    if (intervals.length > 0) {
      return { state: 'closed', next: { day: nextDay, dayOffset: offset, time: intervals[0].open } }
    }
  }
  return { state: 'closed', next: null }
}

export function describeNextOpening(next: NextOpening): string {
  if (next.dayOffset === 0) return `Abre hoje às ${next.time}`
  if (next.dayOffset === 1) return `Abre amanhã às ${next.time}`
  return `Abre ${WEEKDAY_WITH_PREPOSITION[next.day]} às ${next.time}`
}

export function formatDayHours(day: DayHours): string {
  const intervals = toIntervals(day)
  if (intervals === null) return 'A confirmar'
  if (intervals.length === 0) return 'Fechado'
  return intervals.map((i) => `${i.open} – ${i.close}`).join(' · ')
}

export function todayKey(timeZone: string, date: Date = new Date()): Weekday {
  return zonedNow(date, timeZone).day
}
