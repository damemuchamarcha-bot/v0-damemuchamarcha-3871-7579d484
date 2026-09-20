import type { Metadata } from 'next'
import { getBySection } from '@/lib/articles'
import { ArticleListing } from '@/components/article-listing'

export const metadata: Metadata = {
  title: 'Cine — Dame Marcha',
  description:
    'Próximos estrenos, análisis y crítica de cine sin concesiones. La cartelera vista desde la trinchera.',
}

export default function CinePage() {
  return (
    <ArticleListing
      eyebrow="Sección"
      title="Cine"
      description="Próximos estrenos, análisis y crítica sin concesiones. La cartelera vista desde la trinchera, con criterio y sin postureo."
      articles={getBySection('cine')}
    />
  )
}
