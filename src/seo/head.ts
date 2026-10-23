import { SITE } from '../config/site.ts'
import { SCHEMA_DAY, WEEK_ORDER, isScheduleComplete, toIntervals } from '../lib/hours.ts'
import { fullAddress, isValidBRPhone, mapsDirectionsHref, mapsPlaceHref, toInternationalBR } from '../lib/links.ts'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const absolute = (path: string) => (SITE.url ? new URL(path, `${SITE.url}/`).href : path)

/** Schema.org HardwareStore apenas com dados confirmados em site.ts. */
export function buildStructuredData(): Record<string, unknown> {
  const { address } = SITE
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    name: SITE.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.street}, ${address.number} - ${address.district}`,
      addressLocality: address.city,
      addressRegion: address.state,
      addressCountry: address.countryCode,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
    },
    hasMap: mapsPlaceHref(),
  }

  if (SITE.url) {
    data['@id'] = `${SITE.url}/#loja`
    data.url = `${SITE.url}/`
  }
  if (SITE.logo) data.logo = absolute(SITE.logo.src)

  const phone = [SITE.contact.phone, SITE.contact.whatsapp.number].find((n) => isValidBRPhone(n))
  if (phone) data.telephone = `+${toInternationalBR(phone)}`

  // Só publica horários quando todos os dias estão cadastrados (evita dar a entender que fecha nos outros).
  if (isScheduleComplete(SITE.hours.week)) {
    data.openingHoursSpecification = WEEK_ORDER.flatMap((day) =>
      (toIntervals(SITE.hours.week[day]) ?? []).map((i) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SCHEMA_DAY[day],
        opens: i.open,
        closes: i.close,
      })),
    )
  }

  const realPhotos = SITE.gallery.photos.filter((p) => !p.illustrative)
  if (realPhotos.length) data.image = realPhotos.slice(0, 3).map((p) => absolute(p.src))

  return data
}

export function renderHeadTags(): string {
  const { title, description, ogImage, ogImageAlt } = SITE.seo
  const image = escapeHtml(absolute(ogImage))
  const url = SITE.url ? `${SITE.url}/` : ''

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    url && `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    url && `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(buildStructuredData()).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.filter(Boolean).join('\n    ')
}

/** Conteúdo mínimo para quem navega sem JavaScript. */
export function renderNoscript(): string {
  return `<noscript>
      <div style="padding:32px;font-family:system-ui,sans-serif;background:#1D5C3D;color:#F6F5F0;min-height:100vh">
        <h1 style="margin:0 0 12px">${escapeHtml(SITE.name)}</h1>
        <p style="margin:0 0 16px">${escapeHtml(fullAddress())}</p>
        <p style="margin:0"><a style="color:#FFFFFF;text-decoration:underline" href="${escapeHtml(mapsDirectionsHref())}">Ver rota no Google Maps</a></p>
      </div>
    </noscript>`
}
