import type { Metadata } from 'next'
import Image from 'next/image'
import { Megaphone, Flame, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotras — Dame Marcha',
  description:
    'Quiénes somos y por qué hacemos Dame Marcha: una revista cultural de cine y música hecha desde el barrio.',
}

const VALUES = [
  {
    Icon: Megaphone,
    title: 'Voz propia',
    text: 'No repetimos notas de prensa. Escribimos lo que pensamos, guste a quien guste.',
  },
  {
    Icon: Flame,
    title: 'Sin filtros',
    text: 'Crítica honesta, apasionada y con criterio. La cultura se defiende con argumentos.',
  },
  {
    Icon: Heart,
    title: 'De barrio',
    text: 'Nacimos entre salas pequeñas y conciertos sudados. De ahí no nos movemos.',
  },
]

export default function SobreNosotrasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b-2 border-punk-pink pb-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-punk-yellow">
          Quiénes somos
        </span>
        <h1 className="mt-3 text-balance font-display text-5xl uppercase leading-[0.9] tracking-tight text-punk-cream sm:text-7xl">
          Sobre <span className="text-punk-pink">Nosotras</span>
        </h1>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden border-2 border-punk-yellow">
          <Image
            src="/images/sobre-nosotras.png"
            alt="El equipo editorial de Dame Marcha en su estudio"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 text-pretty text-lg leading-relaxed text-punk-cream/80">
          <p>
            <span className="font-display text-2xl uppercase text-punk-cream">Dame Marcha</span>{' '}
            nació en una cocina, entre discos apilados y entradas de cine arrugadas. Estábamos
            hartas de leer sobre cultura como si fuera un catálogo, así que montamos nuestra
            propia revista.
          </p>
          <p>
            Hablamos de cine y de música porque son las dos cosas que nos han salvado más
            veces. Lo hacemos con rabia, con humor y con un respeto absoluto por quien lee.
            Nada de textos vacíos ni entusiasmo de encargo.
          </p>
          <p>
            Somos independientes, ruidosas y muy cabezotas. Si algo nos gusta, lo gritamos.
            Si algo nos parece una estafa, también. Esa es toda la línea editorial que
            necesitamos.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {VALUES.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="flex flex-col gap-4 border-2 border-white/10 bg-card p-7 transition-colors hover:border-punk-pink"
          >
            <span className="flex size-12 items-center justify-center bg-punk-pink text-punk-black">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl uppercase tracking-tight text-punk-cream">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-punk-cream/70">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 border-2 border-punk-yellow bg-punk-charcoal p-8 sm:p-12">
        <blockquote className="text-balance font-display text-3xl uppercase leading-tight tracking-tight text-punk-cream sm:text-5xl">
          {'"'}La cultura no es decoración. Es la <span className="text-punk-pink">marcha</span>{' '}
          que nos mantiene de pie.{'"'}
        </blockquote>
        <p className="mt-6 font-display text-sm uppercase tracking-[0.2em] text-punk-yellow">
          — El equipo de Dame Marcha
        </p>
      </div>
    </div>
  )
}
