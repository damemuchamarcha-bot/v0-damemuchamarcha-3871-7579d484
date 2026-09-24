import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { articles, getArticle, getRecent } from '@/lib/articles'
import { CategoryTag } from '@/components/category-tag'
import { ArticleCard } from '@/components/article-card'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Artículo no encontrado — Dame Marcha' }
  return {
    title: `${article.title} — Dame Marcha`,
    description: article.excerpt,
  }
}

// Helper para transformar enlaces de YouTube/Spotify/Instagram en embeds automáticos
function renderEmbeddedMedia(href: string) {
  const cleanHref = href.trim()

  // Spotify embed (canciones, álbumes, playlists o episodios)
  const spMatch = cleanHref.match(/(?:https?:\/\/)?(?:open\.)?spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/)
  if (spMatch && spMatch[1] && spMatch[2]) {
    return (
      <span className="my-8 block w-full">
        <span className="block overflow-hidden border-2 border-punk-pink">
          <iframe
            title="Reproductor de Spotify"
            src={`https://open.spotify.com/embed/${spMatch[1]}/${spMatch[2]}`}
            width="100%"
            height={spMatch[1] === 'track' ? '152' : '352'}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="block border-0"
          />
        </span>
      </span>
    )
  }

  // YouTube embed
  const ytMatch = cleanHref.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return (
      <span className="my-8 block w-full">
        <span className="relative block aspect-video w-full overflow-hidden border-2 border-punk-yellow">
          <iframe
            title="Reproductor de YouTube"
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </span>
      </span>
    )
  }

  // Instagram embed
  const igMatch = cleanHref.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/)
  if (igMatch && igMatch[1]) {
    return (
      <span className="my-8 block w-full">
        <span className="relative block aspect-[4/5] max-w-md mx-auto overflow-hidden border-2 border-punk-cream/20">
          <iframe
            title="Publicación de Instagram"
            src={`https://www.instagram.com/p/${igMatch[1]}/embed`}
            loading="lazy"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </span>
      </span>
    )
  }

  return null
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const related = getRecent(article.slug).slice(0, 3)

  return (
    <article>
      {/* Header image de portada */}
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <Image
          src={article.image || '/placeholder.svg'}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized={article.image?.startsWith('/uploads')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-punk-black via-punk-black/50 to-punk-black/20" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-3xl px-4 sm:px-6">
        <Link
          href={`/${article.section}`}
          className="mb-6 inline-flex items-center gap-2 font-display text-sm uppercase tracking-wide text-punk-yellow drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] transition-colors hover:text-punk-pink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a {article.section === 'cine' ? 'Cine' : 'Música'}
        </Link>

        <div className="mb-4">
          <CategoryTag label={article.categoryLabel} section={article.section} />
        </div>

        <h1 className="text-balance font-display text-4xl uppercase leading-[0.92] tracking-tight text-punk-cream sm:text-6xl">
          {article.title}
        </h1>

        <p className="mt-5 text-pretty text-lg leading-relaxed text-punk-cream/75">
          {article.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y-2 border-white/10 py-4 text-sm text-punk-cream/70">
          <span className="font-semibold uppercase tracking-wide text-punk-cream">
            Por {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" aria-hidden="true" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {article.readingTime}
          </span>
        </div>

        {/* Cuerpo del artículo */}
        <div className="mt-10 flex flex-col gap-6">
          {article.body.map((para, i) => {
            const trimmed = para.trim()

            // Si el bloque entero es una URL directa de Spotify, Youtube o Instagram
            const mediaEmbed = renderEmbeddedMedia(trimmed)
            if (mediaEmbed) {
              return <div key={i}>{mediaEmbed}</div>
            }

            // Si es un bloque HTML (p. ej. las galerías subidas desde el editor)
            const isHTML = trimmed.startsWith('<') && trimmed.endsWith('>')
            if (isHTML) {
              return (
                <div
                  key={i}
                  className="my-4 text-pretty text-lg leading-[1.8] text-punk-cream/85"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              )
            }

            // Texto Markdown estándar
            return (
              <div
                key={i}
                className={`text-pretty text-lg leading-[1.8] text-punk-cream/85 ${
                  i === 0
                    ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-punk-pink'
                    : ''
                }`}
              >
                <ReactMarkdown
                  components={{
                    strong: ({ node, ...props }) => <strong className="font-bold text-punk-pink" {...props} />,
                    em: ({ node, ...props }) => <em className="italic text-punk-cream" {...props} />,
                    p: ({ node, children, ...props }) => <p className="m-0 inline" {...props}>{children}</p>,
                    
                    // Renderizado automático de enlaces Markdown
                    a: ({ node, href, children, ...props }) => {
                      if (href) {
                        const embed = renderEmbeddedMedia(href)
                        if (embed) return embed
                      }
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-punk-yellow underline hover:text-punk-pink transition-colors"
                          {...props}
                        >
                          {children}
                        </a>
                      )
                    },

                    // Renderizado de imágenes Markdown
                    img: ({ node, src, alt, ...props }) => {
                      if (!src) return null
                      let finalSrc = src
                      if (finalSrc.startsWith('uploads/')) finalSrc = `/${finalSrc}`

                      return (
                        <span className="my-8 block w-full">
                          <span className="relative block aspect-[16/9] w-full overflow-hidden border-2 border-white/10">
                            <Image
                              src={finalSrc}
                              alt={alt || 'Imagen del artículo'}
                              fill
                              sizes="(max-width: 768px) 100vw, 768px"
                              className="object-cover"
                              unoptimized={finalSrc.startsWith('/uploads') || finalSrc.startsWith('uploads/')}
                            />
                          </span>
                          {alt && (
                            <span className="mt-2 block text-center font-mono text-xs text-punk-cream/60">
                              {alt}
                            </span>
                          )}
                        </span>
                      )
                    },
                  }}
                >
                  {para}
                </ReactMarkdown>
              </div>
            )
          })}
        </div>

        {/* Galería adicional opcional de la cabecera */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="mt-12 mb-4">
            <h2 className="mb-4 font-display text-2xl uppercase tracking-tight text-punk-cream">
              Galería <span className="text-punk-yellow">/</span> Fotos
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {article.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden border-2 border-white/10"
                >
                  <Image
                    src={src.startsWith('uploads/') ? `/${src}` : src}
                    alt={`${article.title} — imagen ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized={src.startsWith('/uploads') || src.startsWith('uploads/')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Relacionados */}
      <section className="mx-auto mt-16 max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 border-b-2 border-punk-pink pb-4">
          <h2 className="font-display text-3xl uppercase leading-none tracking-tight text-punk-cream sm:text-4xl">
            Sigue la <span className="text-punk-pink">marcha</span>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </article>
  )
}
