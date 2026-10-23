import { describe, expect, it } from 'vitest'
import type { DayHours, Weekday } from '../config/types'
import {
  describeNextOpening,
  formatDayHours,
  getStoreStatus,
  isScheduleComplete,
  isScheduleConfigured,
  parseTime,
  zonedNow,
} from './hours'

const TZ = 'America/Sao_Paulo'
const weekday = [
  { open: '07:30', close: '11:30' },
  { open: '13:00', close: '18:00' },
]
const FULL: Record<Weekday, DayHours> = {
  monday: weekday,
  tuesday: weekday,
  wednesday: weekday,
  thursday: weekday,
  friday: weekday,
  saturday: [{ open: '07:30', close: '12:00' }],
  sunday: 'closed',
}
const EMPTY: Record<Weekday, DayHours> = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
}

// 23/10/2026 é uma sexta-feira. São Paulo = UTC-3 (sem horário de verão).
const at = (iso: string) => new Date(iso)

describe('zonedNow', () => {
  it('usa o fuso de Guariba, não o do computador', () => {
    expect(zonedNow(at('2026-10-23T11:42:00Z'), TZ)).toEqual({ day: 'friday', minutes: 8 * 60 + 42 })
  })
  it('vira o dia à meia-noite local', () => {
    expect(zonedNow(at('2026-10-24T03:00:00Z'), TZ)).toEqual({ day: 'saturday', minutes: 0 })
  })
})

describe('getStoreStatus', () => {
  it('sem horários cadastrados nunca diz aberta nem fechada', () => {
    expect(getStoreStatus(EMPTY, TZ, at('2026-10-23T11:42:00Z'))).toEqual({ state: 'unknown' })
  })

  it('aberta no meio da manhã', () => {
    expect(getStoreStatus(FULL, TZ, at('2026-10-23T11:42:00Z'))).toEqual({
      state: 'open',
      closesAt: '11:30',
      closingSoon: false,
    })
  })

  it('avisa quando fecha em menos de 1 hora', () => {
    const status = getStoreStatus(FULL, TZ, at('2026-10-23T14:00:00Z'))
    expect(status).toEqual({ state: 'open', closesAt: '11:30', closingSoon: true })
  })

  it('fechada no almoço, abre de novo hoje', () => {
    const status = getStoreStatus(FULL, TZ, at('2026-10-23T15:00:00Z'))
    expect(status).toEqual({ state: 'closed', next: { day: 'friday', dayOffset: 0, time: '13:00' } })
    if (status.state === 'closed' && status.next) expect(describeNextOpening(status.next)).toBe('Abre hoje às 13:00')
  })

  it('fechada à noite, abre amanhã', () => {
    const status = getStoreStatus(FULL, TZ, at('2026-10-23T21:30:00Z'))
    expect(status).toEqual({ state: 'closed', next: { day: 'saturday', dayOffset: 1, time: '07:30' } })
    if (status.state === 'closed' && status.next) expect(describeNextOpening(status.next)).toBe('Abre amanhã às 07:30')
  })

  it('pula o domingo fechado', () => {
    const status = getStoreStatus(FULL, TZ, at('2026-10-24T16:00:00Z'))
    expect(status).toEqual({ state: 'closed', next: { day: 'monday', dayOffset: 2, time: '07:30' } })
    if (status.state === 'closed' && status.next) {
      expect(describeNextOpening(status.next)).toBe('Abre na segunda-feira às 07:30')
    }
  })

  it('o horário de fechamento já conta como fechado', () => {
    expect(getStoreStatus(FULL, TZ, at('2026-10-23T21:00:00Z')).state).toBe('closed')
  })

  it('não prevê abertura passando por um dia sem informação', () => {
    const partial = { ...FULL, saturday: null }
    expect(getStoreStatus(partial, TZ, at('2026-10-23T21:30:00Z'))).toEqual({ state: 'closed', next: null })
  })

  it('dia de hoje sem informação = status desconhecido', () => {
    const partial = { ...FULL, friday: null }
    expect(getStoreStatus(partial, TZ, at('2026-10-23T11:42:00Z'))).toEqual({ state: 'unknown' })
  })

  it('faixas inválidas não viram "fechado"', () => {
    const broken = { ...FULL, friday: [{ open: '18:00', close: '08:00' }] }
    expect(getStoreStatus(broken, TZ, at('2026-10-23T11:42:00Z'))).toEqual({ state: 'unknown' })
  })
})

describe('helpers', () => {
  it('parseTime', () => {
    expect(parseTime('07:30')).toBe(450)
    expect(parseTime('7:05')).toBe(425)
    expect(parseTime('24:00')).toBe(1440)
    expect(parseTime('24:30')).toBeNull()
    expect(parseTime('12:60')).toBeNull()
    expect(parseTime('meio-dia')).toBeNull()
  })

  it('formatDayHours', () => {
    expect(formatDayHours(null)).toBe('A confirmar')
    expect(formatDayHours('closed')).toBe('Fechado')
    expect(formatDayHours([{ open: '7:30', close: '18:00' }])).toBe('07:30 – 18:00')
    expect(formatDayHours(weekday)).toBe('07:30 – 11:30 · 13:00 – 18:00')
  })

  it('configuração completa ou parcial', () => {
    expect(isScheduleConfigured(EMPTY)).toBe(false)
    expect(isScheduleConfigured({ ...EMPTY, monday: 'closed' })).toBe(true)
    expect(isScheduleComplete(FULL)).toBe(true)
    expect(isScheduleComplete({ ...FULL, sunday: null })).toBe(false)
  })
})
