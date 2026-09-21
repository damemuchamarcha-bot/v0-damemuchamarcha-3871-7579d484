import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export type Section = 'cine' | 'musica'

export type CategorySlug =
  | 'proximos-estrenos'
  | 'analisis-de-cine'
  | 'critica-de-cine'
  | 'analisis-de-albumes'
  | 'directos'

export type Article = {
  slug: string
  title: string
  excerpt: string
  section: Section
  category: CategorySlug
  categoryLabel: string
  author: string
  date: string
  timeAgo: string
  readingTime: string
  image: string
  featured?: boolean
  spotify?: string
  youtube?: string
  gallery?: string[]
  body: string[]
  pullQuote?: string
  pullQuoteCite?: string
  inlineImage?: string
  inlineImageCaption?: string
}

/* WordPress-style linear content blocks for the reader view */
export type ContentBlock =
  | { type: 'paragraph'; text: string; lead?: boolean }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'youtube'; url: string }
  | { type: 'spotify'; url: string }

/**
 * Composes the sequential block stream the reader renders:
 * intro → image (+caption) → body → pull-quote → body → youtube → spotify → outro.
 * Falls back gracefully when an article lacks a given media field.
 */
export function getArticleBlocks(article: Article): ContentBlock[] {
  const [p1, p2, p3, p4] = article.body
  const blocks: ContentBlock[] = []

  if (p1) blocks.push({ type: 'paragraph', text: p1, lead: true })

  const inline = article.inlineImage ?? article.gallery?.[0]
  if (inline) {
    blocks.push({
      type: 'image',
      src: inline,
      caption: article.inlineImageCaption ?? article.title,
    })
  }

  if (p2) blocks.push({ type: 'paragraph', text: p2 })

  if (article.pullQuote) {
    blocks.push({
      type: 'quote',
      text: article.pullQuote,
      cite: article.pullQuoteCite ?? article.author,
    })
  }

  if (p3) blocks.push({ type: 'paragraph', text: p3 })

  if (article.youtube) blocks.push({ type: 'youtube', url: article.youtube })
  if (article.spotify) blocks.push({ type: 'spotify', url: article.spotify })

  if (p4) blocks.push({ type: 'paragraph', text: p4 })

  return blocks
}

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'proximos-estrenos': 'Próximos Estrenos',
  'analisis-de-cine': 'Análisis de Cine',
  'critica-de-cine': 'Crítica de Cine',
  'analisis-de-albumes': 'Análisis de Álbumes',
  directos: 'Directos',
}

export const SECTION_CATEGORIES: Record<Section, CategorySlug[]> = {
  cine: ['proximos-estrenos', 'analisis-de-cine', 'critica-de-cine'],
  musica: ['analisis-de-albumes', 'directos'],
}

// Función para obtener todos los artículos dinámicamente desde content/articles
// Función para obtener todos los artículos dinámicamente desde content/articles de forma segura
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

      // Si el archivo no tiene título o slug, lo ignoramos para que no rompa la web
      if (!matterResult.data.title) {
        return null
      }

      const rawBody = matterResult.content
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)

      return {
        slug,
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt || '',
        section: matterResult.data.section || 'musica',
        category: matterResult.data.category || 'analisis-de-albumes',
        categoryLabel: matterResult.data.categoryLabel || 'Análisis de Álbumes',
        author: matterResult.data.author || 'Redacción',
        date: matterResult.data.date ? new Date(matterResult.data.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '18 SEP 2026',
        timeAgo: matterResult.data.timeAgo || 'Reciente',
        readingTime: matterResult.data.readingTime || '5 min de lectura',
        image: matterResult.data.image || '/images/musica-album.png',
        featured: matterResult.data.featured || false,
        spotify: matterResult.data.spotify,
        youtube: matterResult.data.youtube,
        gallery: matterResult.data.gallery,
        body: rawBody.length > 0 ? rawBody : ['Contenido próximamente...'],
        pullQuote: matterResult.data.pullQuote,
        pullQuoteCite: matterResult.data.pullQuoteCite,
        inlineImage: matterResult.data.inlineImage,
        inlineImageCaption: matterResult.data.inlineImageCaption,
      } as Article
    })
    .filter((article): article is Article => article !== null)

  return allArticlesData
}

// Reemplazamos la lista estática por la llamada dinámica
// Reemplazamos la lista estática por la llamada dinámica
export const articles: Article[] = getAllArticles()

export function getArticle(slug: string) {
  return articles.find((a) => a && a.slug === slug)
}

export function getFeatured() {
  const validArticles = articles.filter((a) => a && a.slug)
  return validArticles.find((a) => a.featured) ?? validArticles[0]
}

export function getBySection(section: Section) {
  return articles.filter((a) => a && a.section === section)
}

export function getByCategory(category: CategorySlug) {
  return articles.filter((a) => a && a.category === category)
}

export function getRecent(excludeSlug?: string) {
  return articles.filter((a) => a && a.slug && a.slug !== excludeSlug)
}
