import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export interface Article {
  slug: string
  title: string
  excerpt: string
  section: string
  category: string
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

      // 1. Automatizar imagen de portada (acepta image, thumbnail, portada, etc. y pone la barra /)
      let rawImage = matterResult.data.image || matterResult.data.thumbnail || matterResult.data.portada || '/placeholder.svg'
      if (rawImage && !rawImage.startsWith('http') && !rawImage.startsWith('/')) {
        rawImage = `/${rawImage}`
      }

      // 2. Automatizar YouTube (si pegan el enlace normal o embed, lo convierte y limpia automáticamente)
      let rawYoutube = matterResult.data.youtube || matterResult.data.video || ''
      if (rawYoutube) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = rawYoutube.match(regExp)
        if (match && match[2].length === 11) {
          rawYoutube = `https://www.youtube.com/embed/${match[2]}`
        }
      }

      // 3. Automatizar Spotify (si falta /embed/, lo añade solo)
      let rawSpotify = matterResult.data.spotify || matterResult.data.audio || ''
      if (rawSpotify && !rawSpotify.includes('/embed/')) {
        rawSpotify = rawSpotify.replace('open.spotify.com/', 'open.spotify.com/embed/')
      }

      // 4. Automatizar Galería de imágenes
      const rawGallery = matterResult.data.gallery || matterResult.data.images || []
      const formattedGallery = Array.isArray(rawGallery) 
        ? rawGallery.map((img: string) => (img.startsWith('http') || img.startsWith('/') ? img : `/${img}`))
        : []

      const rawBody = matterResult.content
        ? matterResult.content.split('\n\n').map((p) => p.trim()).filter(Boolean)
        : ['Contenido próximamente...']

      return {
        slug,
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt || '',
        section: matterResult.data.section || 'musica',
        category: matterResult.data.category || 'analisis-de-albumes',
        categoryLabel: matterResult.data.categoryLabel || 'Análisis de Álbumes',
        author: matterResult.data.author || 'Redacción',
        date: matterResult.data.date
          ? new Date(matterResult.data.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
          : '21 SEPT 2026',
        timeAgo: matterResult.data.timeAgo || 'Reciente',
        readingTime: matterResult.data.readingTime || '5 min de lectura',
        image: rawImage,
        featured: matterResult.data.featured || false,
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
