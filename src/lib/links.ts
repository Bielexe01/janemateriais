import { SITE } from '../config/site.ts'

export const onlyDigits = (value: string) => value.replace(/\D/g, '')

/** Normaliza um telefone brasileiro para o formato internacional só com dígitos (55 + DDD + número). */
export function toInternationalBR(raw: string): string {
  const digits = onlyDigits(raw)
  if (!digits) return ''
  if (digits.startsWith('55') && digits.length >= 12) return digits
  return `55${digits}`
}

/** Um número válido tem DDD + 8 ou 9 dígitos. */
export function isValidBRPhone(raw: string): boolean {
  const n = toInternationalBR(raw)
  return n.length === 12 || n.length === 13
}

export function isWhatsAppConfigured(number = SITE.contact.whatsapp.number): boolean {
  return isValidBRPhone(number)
}

/**
 * Link do WhatsApp no formato https://wa.me/55DDDNUMERO.
 * Sem número configurado, abre o WhatsApp só com a mensagem (o visitante escolhe o contato),
 * para que nenhum botão fique quebrado enquanto o número real não for informado.
 */
export function whatsappHref(
  number = SITE.contact.whatsapp.number,
  message = SITE.contact.whatsapp.message,
): string {
  const text = encodeURIComponent(message)
  if (!isValidBRPhone(number)) return `https://wa.me/?text=${text}`
  return `https://wa.me/${toInternationalBR(number)}?text=${text}`
}

export function telHref(raw: string): string {
  return isValidBRPhone(raw) ? `tel:+${toInternationalBR(raw)}` : ''
}

/** (16) 99999-9999 ou (16) 3333-3333 */
export function formatBRPhone(raw: string): string {
  let d = onlyDigits(raw)
  if (d.startsWith('55') && d.length >= 12) d = d.slice(2)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return raw
}

const { address } = SITE

export const addressLines = {
  street: `${address.street}, ${address.number}`,
  city: `${address.district}, ${address.city} - ${address.state}, ${address.country}.`,
}

/** "Avenida José Zanotto, 706 - Jardim Hortencia, Guariba - SP, Brasil" */
export function fullAddress(): string {
  return `${address.street}, ${address.number} - ${address.district}, ${address.city} - ${address.state}, ${address.country}`
}

function mapsQuery(): string {
  return `${SITE.name}, ${fullAddress()}`
}

/** Abre o Google Maps já com a rota até a loja (app no celular, site no computador). */
export function mapsDirectionsHref(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery())}`
}

/** Página da loja no Google Maps (ou busca pelo nome + endereço). */
export function mapsPlaceHref(): string {
  return SITE.maps.placeUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery())}`
}

export function mapsEmbedSrc(): string {
  return (
    SITE.maps.embedUrl ||
    `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery())}&z=16&hl=pt-BR&output=embed`
  )
}

/** Avaliações reais no Google. Sem link específico, leva para a página da loja no Maps. */
export function reviewsHref(): string {
  return SITE.reviews.moreUrl || mapsPlaceHref()
}
