import type { Metadata } from 'next'
import { getBySection } from '@/lib/articles'
import { ArticleListing } from '@/components/article-listing'

export const metadata: Metadata = {
  title: 'Música — Dame Marcha',
  description:
    'Análisis de álbumes y crónicas de directos. La música que importa, a todo volumen.',
}

export default function MusicaPage() {
  return (
    <ArticleListing
      eyebrow="Sección"
      title="Música"
      description="Análisis de álbumes y crónicas de directos. La música que importa contada a todo volumen, con los oídos pitando y el corazón en la garganta."
      articles={getBySection('musica')}
    />
  )
}
