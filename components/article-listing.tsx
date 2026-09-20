import type { Article } from '@/lib/articles'
import { ArticleCard } from '@/components/article-card'

export function ArticleListing({
  eyebrow,
  title,
  description,
  articles,
}: {
  eyebrow: string
  title: string
  description: string
  articles: Article[]
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b-2 border-punk-pink pb-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-punk-yellow">
          {eyebrow}
        </span>
        <h1 className="mt-3 text-balance font-display text-5xl uppercase leading-[0.9] tracking-tight text-punk-cream sm:text-7xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-punk-cream/70 sm:text-lg">
          {description}
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-10 font-display text-2xl uppercase tracking-tight text-punk-cream/50">
          Todavía no hay nada por aquí. Vuelve pronto.
        </p>
      )}
    </section>
  )
}
