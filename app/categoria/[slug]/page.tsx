import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  CATEGORY_LABELS,
  getByCategory,
  type CategorySlug,
} from '@/lib/articles'
import { ArticleListing } from '@/components/article-listing'

const DESCRIPTIONS: Record<CategorySlug, string> = {
  'proximos-estrenos':
    'Lo que llega a la cartelera antes de que llegue. Guía sin spoilers de los estrenos que darán que hablar.',
  'analisis-de-cine':
    'Diseccionamos el cine fotograma a fotograma: montaje, estética y todo lo que se esconde entre planos.',
  'critica-de-cine':
    'Opinión sin anestesia. Las películas que defendemos y las que no, con argumentos y sin complejos.',
  'analisis-de-albumes':
    'Diez canciones, cuarenta minutos y una tesis. Escuchamos los discos enteros para contarte lo que importa.',
  directos:
    'Crónicas desde la primera fila. El sudor, el ruido y esos 90 minutos que no se olvidan.',
}

export function generateStaticParams() {
  return (Object.keys(CATEGORY_LABELS) as CategorySlug[]).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const label = CATEGORY_LABELS[slug as CategorySlug]
  if (!label) return { title: 'Categoría no encontrada — Dame Marcha' }
  return {
    title: `${label} — Dame Marcha`,
    description: DESCRIPTIONS[slug as CategorySlug],
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = slug as CategorySlug
  const label = CATEGORY_LABELS[category]
  if (!label) notFound()

  return (
    <ArticleListing
      eyebrow="Categoría"
      title={label}
      description={DESCRIPTIONS[category]}
      articles={getByCategory(category)}
    />
  )
}
