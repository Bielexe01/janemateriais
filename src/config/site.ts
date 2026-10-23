import type { ImageSource, SiteConfig } from './types.ts'

/*
 * ============================================================================
 *  CONFIGURAÇÃO DO SITE - JANE MATERIAIS PARA CONSTRUÇÃO
 *  Telefone, WhatsApp, endereço, horários, avaliações, fotos e links ficam
 *  todos aqui. Nada de dado comercial inventado: o que não foi informado
 *  fica vazio (ou null) e o site se adapta.
 * ============================================================================
 */

/**
 * Monta src + srcset para imagens salvas como "<base>-<largura>.webp" em /public.
 * Ex.: responsive('/images/hero', [1280, 1920], 1920, 1280)
 */
function responsive(base: string, widths: number[], width: number, height: number): ImageSource {
  return {
    src: `${base}-${widths[widths.length - 1]}.webp`,
    srcSet: widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    width,
    height,
  }
}

const GALLERY_WIDTHS = [640, 1280, 1920]

export const SITE: SiteConfig = {
  name: 'Jane Materiais para Construção',
  url: '',

  seo: {
    title: 'Jane Materiais para Construção | Guariba - SP',
    description:
      'Encontre a Jane Materiais para Construção em Guariba - SP. Confira nossa localização, horário de funcionamento e entre em contato pelo WhatsApp.',
    ogImage: '/og-image.jpg',
    ogImageAlt: 'Jane Materiais para Construção, em Guariba - SP',
  },

  // Quando a logo oficial chegar: salve em /public/brand/ e preencha, por exemplo:
  // logo: { src: '/brand/logo-jane.svg', width: 180, height: 48 },
  logo: null,

  contact: {
    whatsapp: {
      // Só dígitos: DDD + número. Ex.: '16' seguido do número da loja.
      number: '',
      message: 'Olá! Vim pelo site da Jane Materiais para Construção e gostaria de mais informações.',
    },
    phone: '',
  },

  address: {
    street: 'Avenida José Zanotto',
    number: '706',
    district: 'Jardim Hortencia',
    city: 'Guariba',
    state: 'SP',
    country: 'Brasil',
    countryCode: 'BR',
    postalCode: '',
  },

  maps: {
    placeUrl: '',
    embedUrl: '',
  },

  hours: {
    timeZone: 'America/Sao_Paulo',
    // null = ainda não informado | 'closed' = fechado | faixas de horário. Exemplo:
    // monday: [{ open: '07:30', close: '11:30' }, { open: '13:00', close: '18:00' }],
    week: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
  },

  reviews: {
    items: [
      {
        text: 'Loja muito agradável, atendimento nota 10.',
        author: 'Jane Santos',
        when: 'Há 3 meses',
        rating: null,
      },
    ],
    moreUrl: '',
  },

  gallery: {
    // Fotos PROVISÓRIAS (Unsplash). Troque pelas fotos reais e mude illustrative para false.
    photos: [
      {
        title: 'Fachada da loja',
        // Fachada no estilo da marca, enviada pelo cliente (imagem pequena: troque por uma foto em alta quando houver).
        src: '/images/galeria-01-fachada-jane.png',
        width: 337,
        height: 177,
        position: '72% 50%',
        alt: 'Ilustração da fachada da Jane Materiais para Construção: parede verde com a logo, o número 706 e portas de aço',
        illustrative: true,
      },
      {
        title: 'Interior da loja',
        ...responsive('/images/galeria-02-interior', GALLERY_WIDTHS, 1920, 1200),
        alt: 'Imagem ilustrativa: corredor entre prateleiras altas cheias de produtos',
        illustrative: true,
      },
      {
        title: 'Materiais de construção',
        ...responsive('/images/galeria-03-materiais', GALLERY_WIDTHS, 1920, 1440),
        alt: 'Imagem ilustrativa: blocos de concreto empilhados ao lado de placas e revestimentos',
        illustrative: true,
      },
      {
        title: 'Produtos e acabamentos',
        ...responsive('/images/galeria-04-acabamentos', GALLERY_WIDTHS, 1920, 2880),
        alt: 'Imagem ilustrativa: latas de tinta abertas em tons neutros, vistas de cima',
        illustrative: true,
      },
      {
        title: 'Organização do espaço',
        ...responsive('/images/galeria-05-organizacao', GALLERY_WIDTHS, 1920, 1280),
        alt: 'Imagem ilustrativa: ferramentas organizadas em um painel perfurado',
        illustrative: true,
      },
      {
        title: 'Detalhes da loja',
        ...responsive('/images/galeria-06-detalhes', GALLERY_WIDTHS, 1920, 1280),
        alt: 'Imagem ilustrativa: desempenadeira dentada e rolo sobre fundo escuro',
        illustrative: true,
      },
      {
        title: 'Ambiente de atendimento',
        ...responsive('/images/galeria-07-atendimento', GALLERY_WIDTHS, 1920, 1280),
        alt: 'Imagem ilustrativa: loja de ferragens com prateleiras cheias de caixas e uma escada',
        illustrative: true,
      },
      {
        title: 'Visão geral do estabelecimento',
        ...responsive('/images/galeria-08-visao-geral', GALLERY_WIDTHS, 1920, 1280),
        alt: 'Imagem ilustrativa: estantes com telhas e materiais, com madeiras empilhadas à frente',
        illustrative: true,
      },
    ],
    initialCount: 8,
    morePhotosUrl: '',
  },

  images: {
    hero: {
      desktop: responsive('/images/hero', [1280, 1920], 1920, 1280),
      mobile: responsive('/images/hero-m', [640, 960], 960, 1707),
    },
    store: {
      ...responsive('/images/loja-tijolos', [640, 960, 1280], 1280, 1600),
      alt: 'Imagem ilustrativa: tijolos cerâmicos empilhados em um depósito',
      illustrative: true,
    },
    storeDetail: {
      ...responsive('/images/loja-assentamento', [480, 800], 800, 800),
      alt: 'Imagem ilustrativa: mãos assentando blocos com massa e colher de pedreiro',
      illustrative: true,
    },
    contact: {
      ...responsive('/images/contato-obra', [960, 1440, 2048], 2048, 1365),
      alt: 'Imagem ilustrativa: casas de tijolo cerâmico em construção sob céu azul',
      illustrative: true,
    },
  },

  credits: {
    name: 'Go.find',
    // Site oficial da Go.find, quando informado. Vazio = assinatura sem link.
    url: '',
  },
}
