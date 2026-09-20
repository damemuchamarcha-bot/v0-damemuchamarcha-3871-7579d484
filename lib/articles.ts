export interface BlockText {
  type: 'text'
  content: string
}

export interface BlockImage {
  type: 'image'
  src: string
  alt?: string
  caption?: string
}

export interface BlockYoutube {
  type: 'youtube'
  url: string
}

export interface BlockSpotify {
  type: 'spotify'
  url: string
}

export interface BlockSocial {
  type: 'social'
  platform: 'instagram' | 'twitter' | 'tiktok'
  url: string
  label?: string
}

export type ArticleBlock =
  | string
  | BlockText
  | BlockImage
  | BlockYoutube
  | BlockSpotify
  | BlockSocial

export type CategorySlug =
  | 'noticias'
  | 'entrevistas'
  | 'criticas'
  | 'conciertos'
  | 'estrenos'

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  noticias: 'Noticias',
  entrevistas: 'Entrevistas',
  criticas: 'Críticas',
  conciertos: 'Conciertos',
  estrenos: 'Estrenos',
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  readingTime: string
  section: 'musica' | 'cine'
  categoryLabel: string
  categorySlug?: CategorySlug
  featured?: boolean
  image: string
  body: ArticleBlock[]
  spotify?: string
  youtube?: string
  gallery?: string[]
}

export const articles: Article[] = [
  {
    slug: 'mi-primer-articulo',
    title: 'Esto es lo nuevo de Duckwrth A.A.F-B Sides',
    excerpt: 'El nuevo álbum del artista estadounidense',
    author: 'Marta Menjíbar',
    date: '22 SEP 2026',
    readingTime: '3 min lectura',
    section: 'musica',
    categoryLabel: 'Noticias',
    categorySlug: 'noticias',
    featured: true,
    image: '/placeholder.svg',
    body: [
      'El rapero estadounidense Duckwrth lanzó su nuevo disco A.A.F.B - Sides tras su último álbum en 2025, All American F*ckBoy que trajo algunas colaboraciones como con la del rapero IDK.',
      {
        type: 'image',
        src: '/public/images/cf5bf9aae8a04609f5a98a7bdf7bafed.1000x1000x1.png',
        alt: 'Portada del álbum de A.A.F.B-Sides',
        caption: 'Portada del álbum de A.A.F.B-Sides',
      },
      
'Este EP está conformado por 8 canciones de la cara B del álbum de 2025'.

Sweet Fuego 
The Fingerprints
I Wanna Be Your Dog Again
4 Wheel Truck
Draculove
21st Century Freak
Wishing Well
Heart Break Jam
',
      {
        type: 'social',
        platform: 'instagram',
        url: 'https://instagram.com',
        label: 'Síguenos en Instagram',
      },
    ],
  },
  {
    slug: 'segundo-articulo-prueba',
    title: 'NUEVO ÁLBUM Y GIRA CONFIRMADA',
    excerpt: 'Repasamos los detalles del nuevo lanzamiento y las próximas fechas de conciertos.',
    author: 'Dame Marcha',
    date: '19 SEP 2026',
    readingTime: '2 min lectura',
    section: 'musica',
    categoryLabel: 'Conciertos',
    categorySlug: 'conciertos',
    featured: false,
    image: '/placeholder.svg',
    body: ['Texto de ejemplo para la segunda noticia de la portada.'],
  },
  {
    slug: 'estreno-cine-prueba',
    title: 'ESTRENO DE CINE DESTACADO DEL MES',
    excerpt: 'Análisis detallado de la película más esperada de la temporada.',
    author: 'Dame Marcha',
    date: '18 SEP 2026',
    readingTime: '4 min lectura',
    section: 'cine',
    categoryLabel: 'Críticas',
    categorySlug: 'criticas',
    featured: false,
    image: '/placeholder.svg',
    body: ['Texto de ejemplo para la crítica de cine.'],
  },
]

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug)
}

export function getRecent(currentSlug?: string) {
  return articles.filter((a) => a.slug !== currentSlug)
}

export function getFeatured() {
  return articles.find((a) => a.featured) || articles[0]
}

export function getBySection(section: 'musica' | 'cine') {
  return articles.filter((a) => a.section === section)
}

export function getByCategory(categorySlug: string) {
  return articles.filter((a) => a.categorySlug === categorySlug || a.categoryLabel.toLowerCase() === categorySlug.toLowerCase())
}
