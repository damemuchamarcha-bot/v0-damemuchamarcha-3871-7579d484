import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export type CategorySlug = 'analisis-de-albumes' | 'entrevistas' | 'cronicas' | 'criticas' | 'reportajes'

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'analisis-de-albumes': 'Análisis de Álbumes',
  'entrevistas': 'Entrevistas',
  'cronicas': 'Crónicas',
  'criticas': 'Críticas',
  'reportajes': 'Reportajes',
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  section: string
  category: CategorySlug | string
  categoryLabel: string
  author: string
  date: string
  timeAgo: string
  readingTime: string
  image: string
  featured: boolean
  spotify?: string
  youtube?: string
  gallery?: string[]
  body: string[]
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      const data = matterResult.data

      if (!data.title) {
        return null
      }

      // --- TRATAMIENTO DE IMAGEN PARA NEXT.JS ---
      let rawImage = data.image || data.thumbnail || data.portada || data.photo || '/placeholder.svg'
      if (typeof rawImage === 'string' && rawImage.trim() !== '') {
        // Si empieza por uploads/ sin barra o con barra, nos aseguramos de que Next.js la busque bien
        if (rawImage.startsWith('uploads/')) {
          rawImage = `/${rawImage}`
        } else if (!rawImage.startsWith('http') && !rawImage.startsWith('/')) {
          rawImage = `/${rawImage}`
        }
      } else {
        rawImage = '/placeholder.svg'
      }

      // --- YOUTUBE ---
      let rawYoutube = data.youtube || data.video || data.yt || ''
      if (typeof rawYoutube === 'string' && rawYoutube.trim() !== '') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = rawYoutube.match(regExp)
        if (match && match[2].length === 11) {
          rawYoutube = `https://www.youtube.com/embed/${match[2]}`
        }
      } else {
        rawYoutube = ''
      }

      // --- SPOTIFY ---
      let rawSpotify = data.spotify || data.audio || data.spo || ''
      if (typeof rawSpotify === 'string' && rawSpotify.trim() !== '') {
        if (!rawSpotify.includes('/embed/')) {
          rawSpotify = rawSpotify.replace('open.spotify.com/', 'open.spotify.com/embed/')
        }
      } else {
        rawSpotify = ''
      }

      // --- GALERÍA ---
      const rawGallery = data.gallery || data.images || data.fotos || []
      const formattedGallery = Array.isArray(rawGallery) 
        ? rawGallery.map((img: string) => {
            if (typeof img === 'string') {
              if (img.startsWith('uploads/')) return `/${img}`
              return img.startsWith('http') || img.startsWith('/') ? img : `/${img}`
            }
            return ''
          }).filter(Boolean)
        : []

      const rawBody = matterResult.content
        ? matterResult.content.split('\n\n').map((p) => p.trim()).filter(Boolean)
        : ['Contenido próximamente...']

      const category = data.category || 'analisis-de-albumes'

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt || '',
        section: data.section || 'musica',
        category,
        categoryLabel: data.categoryLabel || CATEGORY_LABELS[category as CategorySlug] || 'Artículo',
        author: data.author || 'Redacción',
        date: data.date
          ? new Date(data.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
          : '21 SEPT 2026',
        timeAgo: data.timeAgo || 'Reciente',
        readingTime: data.readingTime || '5 min de lectura',
        image: rawImage,
        featured: Boolean(data.featured),
        spotify: rawSpotify,
        youtube: rawYoutube,
        gallery: formattedGallery,
        body: rawBody,
      } as Article
    })
    .filter((article): article is Article => article !== null)

  return allArticlesData
}

export const articles = getAllArticles()

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getRecent(currentSlug: string): Article[] {
  return articles.filter((article) => article.slug !== currentSlug)
}

export function getFeatured(): Article | undefined {
  return articles.find((article) => article.featured) || articles[0]
}

export function getBySection(section: string): Article[] {
  return articles.filter((article) => article.section.toLowerCase() === section.toLowerCase())
}

export function getByCategory(category: string): Article[] {
  return articles.filter((article) => article.category.toLowerCase() === category.toLowerCase())
}
