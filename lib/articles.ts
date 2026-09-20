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
    title: '¡BIENVENIDOS A DAME MARCHA!',
    excerpt: 'Primer artículo de prueba con texto, imágenes intercaladas y redes sociales.',
    author: 'Dame Marcha',
    date: '20 SEP 2026',
    readingTime: '3 min lectura',
    section: 'musica',
    categoryLabel: 'Noticias',
    categorySlug: 'noticias',
    featured: true,
    image: '/placeholder.svg',
    body: [
      '¡Bienvenidos al nuevo portal! Este es el primer párrafo de texto y arrancará con una letra capitular grande en rosa punk.',
      'Aquí puedes escribir un segundo párrafo explicando más detalles sobre la noticia o la reseña.',
      {
        type: 'image',
        src: '/placeholder.svg',
        alt: 'Imagen de prueba',
        caption: 'Pie de foto de ejemplo para tus imágenes',
      },
      'Este párrafo va justo debajo de la primera imagen intercalada.',
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
