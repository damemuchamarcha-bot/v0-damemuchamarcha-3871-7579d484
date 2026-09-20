import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowLeft, Clock, Calendar, ExternalLink } from 'lucide-react'
import { articles, getArticle, getRecent, ArticleBlock } from '@/lib/articles'
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
      {/* Imagen de portada superior */}
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <Image
          src={article.image || '/placeholder.svg'}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
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

        {/* Cuerpo del artículo basado en bloques */}
        <div className="mt-10 flex flex-col gap-6">
          {article.body.map((block: ArticleBlock, i: number) => {
            // Párrafo de texto simple
            if (typeof block === 'string') {
              return (
                <p
                  key={i}
                  className="text-pretty text-lg leading-[1.8] text-punk-cream/85 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-punk-pink [&:not(:first-child)]:first-letter:float-none [&:not(:first-child)]:first-letter:mr-0 [&:not(:first-child)]:first-letter:text-lg [&:not(:first-child)]:first-letter:text-punk-cream/85"
                >
                  {block}
                </p>
              )
            }

            // Bloque explícito de texto
            if (block.type === 'text') {
              return (
                <p key={i} className="text-pretty text-lg leading-[1.8] text-punk-cream/85">
                  {block.content}
                </p>
              )
            }

            // Imagen intercalada con marco punk
            if (block.type === 'image') {
              return (
                <figure key={i} className="my-4">
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-2 border-punk-pink">
                    <Image
                      src={block.src}
                      alt={block.alt || article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {block.caption && (
                    <figcaption className="mt-2 text-center text-xs uppercase tracking-wider text-punk-cream/60">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              )
            }

            // Reproductor de Spotify
            if (block.type === 'spotify') {
              return (
                <div key={i} className="my-6">
                  <div className="border-2 border-punk-pink">
                    <iframe
                      title="Spotify"
                      src={block.url}
                      width="100%"
                      height="152"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="block"
                    />
                  </div>
                </div>
              )
            }

            // Vídeo de YouTube
            if (block.type === 'youtube') {
              return (
                <div key={i} className="my-6">
                  <div className="relative aspect-video border-2 border-punk-yellow">
                    <iframe
                      title="YouTube"
                      src={block.url}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 size-full"
                    />
                  </div>
                </div>
              )
            }

            // Enlace a redes sociales
            if (block.type === 'social') {
              return (
                <div key={i} className="my-4">
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-punk-yellow bg-punk-black px-4 py-3 font-display text-sm uppercase tracking-wider text-punk-yellow transition-all hover:bg-punk-yellow hover:text-punk-black"
                  >
                    <span>{block.label || `Ver en ${block.platform}`}</span>
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              )
            }

            return null
          })}
        </div>

        {/* Galería opcional al final */}
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
                    src={src || '/placeholder.svg'}
                    alt={`${article.title} — imagen ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Artículos relacionados */}
      {related.length > 0 && (
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
      )}
    </article>
  )
}
