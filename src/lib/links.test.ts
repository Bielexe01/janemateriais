import { describe, expect, it } from 'vitest'
import {
  formatBRPhone,
  fullAddress,
  isValidBRPhone,
  mapsDirectionsHref,
  mapsEmbedSrc,
  mapsPlaceHref,
  telHref,
  toInternationalBR,
  whatsappHref,
} from './links'

// Números fictícios, só para teste.
const FAKE_MOBILE = '(11) 91234-5678'
const FAKE_LANDLINE = '11 3456-7890'

describe('telefone', () => {
  it('normaliza para 55 + DDD + número', () => {
    expect(toInternationalBR(FAKE_MOBILE)).toBe('5511912345678')
    expect(toInternationalBR('+55 11 91234-5678')).toBe('5511912345678')
    expect(toInternationalBR('')).toBe('')
  })

  it('valida tamanho', () => {
    expect(isValidBRPhone(FAKE_MOBILE)).toBe(true)
    expect(isValidBRPhone(FAKE_LANDLINE)).toBe(true)
    expect(isValidBRPhone('12345')).toBe(false)
  })

  it('formata para exibição', () => {
    expect(formatBRPhone('11912345678')).toBe('(11) 91234-5678')
    expect(formatBRPhone('551134567890')).toBe('(11) 3456-7890')
  })

  it('gera tel: apenas com número válido', () => {
    expect(telHref(FAKE_LANDLINE)).toBe('tel:+551134567890')
    expect(telHref('')).toBe('')
  })
})

describe('whatsapp', () => {
  it('usa o formato wa.me/55DDDNUMERO com mensagem', () => {
    expect(whatsappHref(FAKE_MOBILE, 'Olá!')).toBe('https://wa.me/5511912345678?text=Ol%C3%A1!')
  })

  it('sem número configurado continua funcional (só mensagem)', () => {
    expect(whatsappHref('', 'Olá!')).toBe('https://wa.me/?text=Ol%C3%A1!')
  })
})

describe('google maps', () => {
  it('endereço completo', () => {
    expect(fullAddress()).toBe('Avenida José Zanotto, 706 - Jardim Hortencia, Guariba - SP, Brasil')
  })

  it('rota usa a API oficial de URLs do Maps com destino', () => {
    const url = new URL(mapsDirectionsHref())
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/')
    expect(url.searchParams.get('api')).toBe('1')
    expect(url.searchParams.get('destination')).toContain('Avenida José Zanotto, 706')
  })

  it('busca e mapa incorporado apontam para o mesmo endereço', () => {
    expect(new URL(mapsPlaceHref()).searchParams.get('query')).toContain('Guariba - SP')
    expect(new URL(mapsEmbedSrc()).searchParams.get('output')).toBe('embed')
  })
})
