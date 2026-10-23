export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

/** Faixa de horário no formato 24h "HH:MM", no mesmo dia. Ex.: { open: '07:30', close: '18:00' } */
export interface TimeRange {
  open: string
  close: string
}

/**
 * null     -> horário ainda não informado (o site mostra "A confirmar")
 * 'closed' -> fechado o dia todo
 * [faixas] -> aberto nas faixas informadas (aceita intervalo de almoço)
 */
export type DayHours = null | 'closed' | TimeRange[]

export interface ImageSource {
  /** Caminho usado como fallback (pasta /public). */
  src: string
  /** Versões em vários tamanhos, no formato do atributo srcset. Opcional. */
  srcSet?: string
  /** Tamanho real da imagem maior, para o navegador reservar o espaço. */
  width: number
  height: number
}

export interface SiteImage extends ImageSource {
  alt: string
  /** true = foto de banco de imagens, usada só até chegarem as fotos reais da loja. */
  illustrative: boolean
}

export interface GalleryPhoto extends SiteImage {
  title: string
  /** Ponto de enquadramento na miniatura (CSS object-position), ex.: '75% 50%'. */
  position?: string
}

export interface Review {
  text: string
  author: string
  /** Texto como aparece na origem. Ex.: "Há 3 meses". */
  when: string
  /** Nota de 1 a 5. Deixe null enquanto a nota não estiver confirmada: as estrelas não aparecem. */
  rating: number | null
}

export interface SiteConfig {
  name: string
  /** Domínio final, sem barra no fim. Ex.: 'https://www.seudominio.com.br'. */
  url: string
  seo: {
    title: string
    description: string
    ogImage: string
    ogImageAlt: string
  }
  /** Logo oficial. Enquanto for null, o site usa um logotipo em texto provisório. */
  logo: { src: string; width: number; height: number } | null
  contact: {
    whatsapp: {
      /** DDD + número, só dígitos. O código do Brasil (55) é adicionado automaticamente. */
      number: string
      message: string
    }
    /** Telefone fixo opcional (DDD + número). Vazio = não aparece no site. */
    phone: string
  }
  address: {
    street: string
    number: string
    district: string
    city: string
    state: string
    country: string
    countryCode: string
    /** CEP. Vazio enquanto não for confirmado. */
    postalCode: string
  }
  maps: {
    /** Link oficial da loja no Google Maps (botão "Compartilhar"). Vazio = busca pelo endereço. */
    placeUrl: string
    /** Link de incorporação do Google Maps ("Incorporar um mapa"). Vazio = gerado pelo endereço. */
    embedUrl: string
  }
  hours: {
    timeZone: string
    week: Record<Weekday, DayHours>
  }
  reviews: {
    items: Review[]
    /** Link das avaliações da loja no Google. Vazio = página da loja no Google Maps. */
    moreUrl: string
  }
  gallery: {
    photos: GalleryPhoto[]
    /** Quantas fotos aparecem antes do botão "Ver mais fotos". */
    initialCount: number
    /** Link externo com mais fotos reais (Instagram, Google etc.). Vazio = sem link. */
    morePhotosUrl: string
  }
  images: {
    hero: { desktop: ImageSource; mobile: ImageSource }
    store: SiteImage
    storeDetail: SiteImage
    contact: SiteImage
  }
  credits: { name: string; url: string }
}
