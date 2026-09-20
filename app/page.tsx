import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeatured, getRecent } from '@/lib/articles'
import { HeroArticle } from '@/components/hero-article'
import { ArticleCard } from '@/components/article-card'
import { Marquee } from '@/components/marquee'

export default function HomePage() {
  const featured = getFeatured()
  const recent = getRecent(featured.slug)
  const lead = recent[0]
  const rest = recent.slice(1)

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <HeroArticle article={featured} />
      </section>

      <div className="mt-10">
        <Marquee />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between border-b-2 border-punk-pink pb-4">
          <h2 className="font-display text-3xl uppercase leading-none tracking-tight text-punk-cream sm:text-4xl">
            Lo último <span className="text-punk-pink">/</span> Noticias y reseñas
          </h2>
          <span className="hidden font-display text-sm uppercase tracking-[0.2em] text-punk-yellow sm:block">
            Cine · Música
          </span>
        </div>

        {/* Asymmetric editorial grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 lg:row-span-2">
            <ArticleCard article={lead} size="lg" />
          </div>
          {rest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 border-2 border-punk-yellow bg-punk-charcoal px-6 py-10 text-center">
          <h3 className="max-w-2xl text-balance font-display text-3xl uppercase leading-none tracking-tight text-punk-cream sm:text-4xl">
            ¿Te has quedado con ganas de más marcha?
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cine"
              className="flex items-center justify-center gap-2 bg-punk-pink px-6 py-3 font-display text-sm uppercase tracking-wide text-punk-black transition-colors hover:bg-punk-yellow"
            >
              Explorar Cine
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/musica"
              className="flex items-center justify-center gap-2 border-2 border-punk-cream px-6 py-3 font-display text-sm uppercase tracking-wide text-punk-cream transition-colors hover:border-punk-yellow hover:text-punk-yellow"
            >
              Explorar Música
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
