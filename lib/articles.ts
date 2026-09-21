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

      if (!matterResult.data.title) {
        return null
      }

      // Automatización segura de imagen de portada
      let rawImage = matterResult.data.image || matterResult.data.thumbnail || matterResult.data.portada || '/placeholder.svg'
      if (rawImage && !rawImage.startsWith('http') && !rawImage.startsWith('/')) {
        rawImage = `/${rawImage}`
      }

      // Automatización segura de YouTube
      let rawYoutube = matterResult.data.youtube || matterResult.data.video || ''
      if (rawYoutube) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = rawYoutube.match(regExp)
        if (match && match[2].length === 11) {
          rawYoutube = `https://www.youtube.com/embed/${match[2]}`
        }
      }

      // Automatización segura de Spotify
      let rawSpotify = matterResult.data.spotify || matterResult.data.audio || ''
      if (rawSpotify && !rawSpotify.includes('/embed/')) {
        rawSpotify = rawSpotify.replace('open.spotify.com/', 'open.spotify.com/embed/')
      }

      // Automatización segura de Galería
      const rawGallery = matterResult.data.gallery || matterResult.data.images || []
      const formattedGallery = Array.isArray(rawGallery) 
        ? rawGallery.map((img: string) => (img.startsWith('http') || img.startsWith('/') ? img : `/${img}`))
        : []

      const rawBody = matterResult.content
        ? matterResult.content.split('\n\n').map((p) => p.trim()).filter(Boolean)
        : ['Contenido próximamente...']

      const category = matterResult.data.category || 'analisis-de-albumes'

      return {
        slug,
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt || '',
        section: matterResult.data.section || 'musica',
        category,
        categoryLabel: matterResult.data.categoryLabel || CATEGORY_LABELS[category as CategorySlug] || 'Artículo',
        author: matterResult.data.author || 'Redacción',
        date: matterResult.data.date
          ? new Date(matterResult.data.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
          : '21 SEPT 2026',
        timeAgo: matterResult.data.timeAgo || 'Reciente',
        readingTime: matterResult.data.readingTime || '5 min de lectura',
        image: rawImage,
        featured: Boolean(matterResult.data.featured),
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
