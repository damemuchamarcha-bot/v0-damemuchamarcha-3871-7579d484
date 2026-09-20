import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { Article } from '@/lib/articles'
import { CategoryTag } from '@/components/category-tag'

export function HeroArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/articulo/${article.slug}`}
      className="group relative block overflow-hidden border-2 border-white/10 transition-colors hover:border-punk-pink"
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <Image
          src={article.image || '/placeholder.svg'}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-punk-black via-punk-black/60 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryTag label={article.categoryLabel} section={article.section} />
          <span className="font-display text-xs uppercase tracking-[0.2em] text-punk-yellow">
            Portada
          </span>
        </div>
        <h1 className="max-w-4xl text-balance font-display text-4xl uppercase leading-[0.9] tracking-tight text-punk-cream transition-colors group-hover:text-punk-pink sm:text-6xl lg:text-7xl">
          {article.title}
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-punk-cream/80 sm:text-lg">
          {article.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-punk-cream/70">
          <span className="font-semibold uppercase tracking-wide text-punk-cream">
            {article.author}
          </span>
          <span>{article.date}</span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {article.readingTime}
          </span>
          <span className="ml-auto hidden items-center gap-1 font-display text-sm uppercase tracking-wide text-punk-yellow transition-colors group-hover:text-punk-pink sm:flex">
            Leer artículo
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
