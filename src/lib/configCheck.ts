import { SITE } from '../config/site'
import { isScheduleConfigured } from './hours'
import { isWhatsAppConfigured } from './links'

/** Lista, só em desenvolvimento, o que ainda falta preencher em src/config/site.ts. */
export function warnPendingConfig(): void {
  const pending: string[] = []
  if (!isWhatsAppConfigured()) pending.push('Número do WhatsApp  -> contact.whatsapp.number')
  if (!isScheduleConfigured(SITE.hours.week)) pending.push('Horários de funcionamento -> hours.week')
  if (!SITE.logo) pending.push('Logo oficial -> logo')
  if (SITE.gallery.photos.some((p) => p.illustrative)) pending.push('Fotos reais da loja -> gallery.photos')
  if (!SITE.reviews.moreUrl) pending.push('Link das avaliações no Google -> reviews.moreUrl')
  if (!SITE.url) pending.push('Domínio do site (SEO/Open Graph) -> url')
  if (!SITE.credits.url) pending.push('Site da Go.find -> credits.url')
  if (pending.length) {
    console.info(`[Jane] Pendências em src/config/site.ts:\n- ${pending.join('\n- ')}`)
  }
}
