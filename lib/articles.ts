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

export interface Article {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  readingTime: string
  section: 'musica' | 'cine'
  categoryLabel: string
  image: string
  body: ArticleBlock[]
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
    image: '/placeholder.svg',
    body: [
      '¡Bienvenidos al nuevo portal! Este es el primer párrafo de texto y arrancará con una letra capitular grande en rosa punk.',
      
      'Aquí puedes escribir un segundo párrafo explicando más detalles sobre la noticia o la reseña.',

      {
        type: 'image',
        src: '/placeholder.svg',
        alt: 'Imagen de prueba',
        caption: 'Pie de foto de ejemplo para tus imágenes'
      },

      'Este párrafo va justo debajo de la primera imagen intercalada.',

      {
        type: 'social',
        platform: 'instagram',
        url: 'https://instagram.com',
        label: 'Síguenos en Instagram'
      }
    ]
  }
]

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug)
}

export function getRecent(currentSlug?: string) {
  return articles.filter((a) => a.slug !== currentSlug)
}
