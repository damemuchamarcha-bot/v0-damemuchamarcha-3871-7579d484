import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import type { Article } from '@/lib/articles'
import { CategoryTag } from '@/components/category-tag'

export function ArticleCard({
  article,
  size = 'md',
}: {
  article: Article
  size?: 'md' | 'lg'
}) {
  const isLarge = size === 'lg'
  return (
    <Link
      href={`/articulo/${article.slug}`}
      className="group flex h-full flex-col border-2 border-white/10 bg-card transition-colors hover:border-punk-pink"
    >
      <div className={`relative w-full overflow-hidden ${isLarge ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <Image
          src={article.image || '/placeholder.svg'}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute left-3 top-3">
          <CategoryTag label={article.categoryLabel} section={article.section} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3
          className={`text-balance font-display uppercase leading-[0.95] tracking-tight text-punk-cream transition-colors group-hover:text-punk-pink ${
            isLarge ? 'text-3xl' : 'text-xl'
          }`}
        >
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-punk-cream/65">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-punk-cream/50">
          <span className="font-semibold uppercase tracking-wide text-punk-cream/80">
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {article.timeAgo}
          </span>
        </div>
      </div>
    </Link>
  )
}
