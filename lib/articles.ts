export type Section = 'cine' | 'musica'

export type CategorySlug =
  | 'proximos-estrenos'
  | 'analisis-de-cine'
  | 'critica-de-cine'
  | 'analisis-de-albumes'
  | 'directos'

export type Article = {
  slug: string
  title: string
  excerpt: string
  section: Section
  category: CategorySlug
  categoryLabel: string
  author: string
  date: string
  timeAgo: string
  readingTime: string
  image: string
  featured?: boolean
  spotify?: string
  youtube?: string
  gallery?: string[]
  body: string[]
  pullQuote?: string
  pullQuoteCite?: string
  inlineImage?: string
  inlineImageCaption?: string
}

/* WordPress-style linear content blocks for the reader view */
export type ContentBlock =
  | { type: 'paragraph'; text: string; lead?: boolean }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'youtube'; url: string }
  | { type: 'spotify'; url: string }

/**
 * Composes the sequential block stream the reader renders:
 * intro → image (+caption) → body → pull-quote → body → youtube → spotify → outro.
 * Falls back gracefully when an article lacks a given media field.
 */
export function getArticleBlocks(article: Article): ContentBlock[] {
  const [p1, p2, p3, p4] = article.body
  const blocks: ContentBlock[] = []

  if (p1) blocks.push({ type: 'paragraph', text: p1, lead: true })

  const inline = article.inlineImage ?? article.gallery?.[0]
  if (inline) {
    blocks.push({
      type: 'image',
      src: inline,
      caption: article.inlineImageCaption ?? article.title,
    })
  }

  if (p2) blocks.push({ type: 'paragraph', text: p2 })

  if (article.pullQuote) {
    blocks.push({
      type: 'quote',
      text: article.pullQuote,
      cite: article.pullQuoteCite ?? article.author,
    })
  }

  if (p3) blocks.push({ type: 'paragraph', text: p3 })

  if (article.youtube) blocks.push({ type: 'youtube', url: article.youtube })
  if (article.spotify) blocks.push({ type: 'spotify', url: article.spotify })

  if (p4) blocks.push({ type: 'paragraph', text: p4 })

  return blocks
}

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'proximos-estrenos': 'Próximos Estrenos',
  'analisis-de-cine': 'Análisis de Cine',
  'critica-de-cine': 'Crítica de Cine',
  'analisis-de-albumes': 'Análisis de Álbumes',
  directos: 'Directos',
}

export const SECTION_CATEGORIES: Record<Section, CategorySlug[]> = {
  cine: ['proximos-estrenos', 'analisis-de-cine', 'critica-de-cine'],
  musica: ['analisis-de-albumes', 'directos'],
}

export const articles: Article[] = [
  {
    slug: 'neon-noir-el-regreso-del-cine-negro',
    title: 'Neon Noir: el regreso salvaje del cine negro',
    excerpt:
      'Una nueva ola de directores rescata las sombras del noir y las tiñe de luces de neón. Analizamos por qué el género más oscuro vuelve a marcar el ritmo.',
    section: 'cine',
    category: 'analisis-de-cine',
    categoryLabel: 'Análisis de Cine',
    author: 'Lucía Bravo',
    date: '18 SEP 2026',
    timeAgo: 'Hace 2 horas',
    readingTime: '7 min de lectura',
    image: '/images/hero-cine.png',
    featured: true,
    youtube: 'https://www.youtube.com/embed/5PSNL1qE6VY',
    spotify: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
    gallery: ['/images/gallery-1.png', '/images/cine-critica.png'],
    inlineImage: '/images/cine-critica.png',
    inlineImageCaption:
      'La sala vacía, el proyector encendido: el ritual del noir sigue intacto bajo otra luz.',
    pullQuote:
      'El neón no decora: acusa. Cada rótulo encendido es una confesión que el personaje todavía no ha hecho.',
    pullQuoteCite: 'Lucía Bravo',
    body: [
      'El cine negro nunca murió del todo; solo esperaba en el callejón, encendiendo un cigarro bajo un rótulo de neón. En los últimos meses hemos visto cómo una generación de cineastas jóvenes reivindica las claves del noir clásico y las reescribe con una paleta imposible: negros profundos partidos por rosas eléctricos y amarillos ácidos.',
      'Lo que antes eran claroscuros de blanco y negro ahora son ciudades empapadas de lluvia y luz artificial. La moral sigue siendo ambigua, los personajes siguen atrapados, pero la estética grita desde la primera secuencia.',
      'No se trata de nostalgia. Se trata de usar un lenguaje reconocible para hablar de la ansiedad contemporánea: la vigilancia, la soledad urbana, la sensación de estar siempre a punto de perderlo todo. El neón no decora, acusa.',
      'Si algo demuestra esta ola es que el género negro sigue siendo el mejor espejo deformante de nuestras obsesiones. Y esta vez, además, suena de miedo.',
    ],
  },
  {
    slug: 'directo-incendiario-en-la-sala-caotica',
    title: 'Directo incendiario: 90 minutos que hicieron temblar la sala',
    excerpt:
      'Crónica de un concierto que empezó tarde, acabó sin voz y dejó a todo el mundo con el corazón en la garganta.',
    section: 'musica',
    category: 'directos',
    categoryLabel: 'Directos',
    author: 'Marta Quintana',
    date: '17 SEP 2026',
    timeAgo: 'Hace 6 horas',
    readingTime: '5 min de lectura',
    image: '/images/musica-directo.png',
    spotify: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcF6B6QPhFDv',
    gallery: ['/images/gallery-2.png', '/images/gallery-1.png'],
    inlineImage: '/images/gallery-2.png',
    inlineImageCaption: 'Manos, cuerdas y sudor: el momento exacto en que la sala dejó de respirar.',
    pullQuote:
      'Salimos a la calle sin voz y con los oídos pitando. Ese pitido era la prueba de que algo real había pasado.',
    pullQuoteCite: 'Marta Quintana',
    body: [
      'A las nueve y media todavía había cola en la puerta. A las diez, la sala era una olla a presión. Cuando por fin se apagaron las luces, el rugido fue tan bestia que las paredes parecían respirar.',
      'La banda salió sin saludar, enchufó y disparó. No hubo tregua durante la primera media hora: riffs afilados, batería a bocajarro y una voz que se rompía en los agudos como si le fuera la vida en ello.',
      'Hubo momentos de pura comunión punk, con el público coreando cada estribillo, y también silencios eléctricos donde solo se oía el zumbido de los amplificadores. Ese contraste es exactamente lo que separa un buen directo de uno inolvidable.',
      'Salimos a la calle sin voz y con los oídos pitando. Mereció la pena cada decibelio.',
    ],
  },
  {
    slug: 'anatomia-de-un-album-generacional',
    title: 'Anatomía de un álbum generacional',
    excerpt:
      'Diez canciones, cuarenta minutos y una tesis clarísima: la rabia también puede ser preciosa. Diseccionamos el disco del año.',
    section: 'musica',
    category: 'analisis-de-albumes',
    categoryLabel: 'Análisis de Álbumes',
    author: 'Nerea Castro',
    date: '16 SEP 2026',
    timeAgo: 'Hace 1 día',
    readingTime: '9 min de lectura',
    image: '/images/musica-album.png',
    spotify: 'https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3',
    body: [
      'Hay discos que se escuchan y discos que se habitan. Este pertenece a la segunda categoría. Desde el primer segundo queda claro que no busca gustar a todo el mundo, y precisamente por eso conecta con quien tiene que conectar.',
      'La producción es sucia a propósito, con guitarras que raspan y una voz colocada muy al frente de la mezcla. Cada decisión técnica está al servicio de una idea: la autenticidad por encima del acabado perfecto.',
      'Letras que hablan de precariedad, de amistad y de seguir en pie cuando todo empuja hacia abajo. Es un disco de barrio con ambición universal.',
    ],
  },
  {
    slug: 'los-estrenos-que-marcaran-el-otono',
    title: 'Los estrenos que marcarán el otoño',
    excerpt:
      'Del thriller de autor al debut más esperado del año. Esta es nuestra guía sin spoilers de lo que llega a la cartelera.',
    section: 'cine',
    category: 'proximos-estrenos',
    categoryLabel: 'Próximos Estrenos',
    author: 'Lucía Bravo',
    date: '15 SEP 2026',
    timeAgo: 'Hace 1 día',
    readingTime: '6 min de lectura',
    image: '/images/cine-estrenos.png',
    youtube: 'https://www.youtube.com/embed/5PSNL1qE6VY',
    body: [
      'El otoño siempre trae las apuestas fuertes de la temporada, y este año no es una excepción. La cartelera se llena de propuestas que van del cine de autor más radical al espectáculo de gran presupuesto.',
      'Hemos seleccionado los títulos que creemos que darán que hablar, ya sea por su ambición formal, por su discurso o simplemente por las ganas que tenemos de verlos.',
      'Marca estas fechas en el calendario: se avecina una temporada intensa.',
    ],
  },
  {
    slug: 'critica-una-pelicula-que-no-pide-permiso',
    title: 'Crítica: una película que no pide permiso',
    excerpt:
      'Incómoda, ruidosa y absolutamente necesaria. Un debut que divide a la crítica y que nosotras defendemos sin complejos.',
    section: 'cine',
    category: 'critica-de-cine',
    categoryLabel: 'Crítica de Cine',
    author: 'Marta Quintana',
    date: '14 SEP 2026',
    timeAgo: 'Hace 2 días',
    readingTime: '5 min de lectura',
    image: '/images/cine-critica.png',
    gallery: ['/images/cine-analisis.png', '/images/hero-cine.png'],
    body: [
      'Hay películas educadas y películas que entran dando un portazo. Esta pertenece al segundo grupo, y se agradece. No hay concesiones, no hay explicaciones de más, no hay ganas de gustar.',
      'La dirección apuesta por planos largos e incómodos que obligan a mirar donde normalmente apartaríamos la vista. Es un cine físico, casi táctil, que se te mete debajo de la piel.',
      'No es una película perfecta, pero es honesta hasta el tuétano. Y en los tiempos que corren, eso vale oro.',
    ],
  },
  {
    slug: 'el-vinilo-ha-vuelto-y-no-se-va',
    title: 'El vinilo ha vuelto (y no se va)',
    excerpt:
      'Más allá de la moda: por qué toda una generación redescubre el ritual de poner un disco y escucharlo entero.',
    section: 'musica',
    category: 'analisis-de-albumes',
    categoryLabel: 'Análisis de Álbumes',
    author: 'Nerea Castro',
    date: '12 SEP 2026',
    timeAgo: 'Hace 4 días',
    readingTime: '4 min de lectura',
    image: '/images/musica-analisis.png',
    spotify: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
    body: [
      'El vinilo no ha vuelto por nostalgia, sino por hastío. En un mundo de reproducción infinita y algoritmos, poner un disco y escucharlo de principio a fin se ha convertido en un acto casi radical.',
      'Es un gesto de atención plena: eliges, colocas la aguja y te comprometes con cuarenta minutos de música sin saltar de canción. El objeto físico devuelve el valor a algo que se había vuelto invisible.',
      'No es para todo el mundo, y está bien. Pero para quien lo vive, es una manera de reconciliarse con el placer lento de escuchar.',
    ],
  },
  {
    slug: 'doble-exposicion-el-montaje-como-arma',
    title: 'Doble exposición: el montaje como arma política',
    excerpt:
      'Analizamos cómo un puñado de directoras están usando el montaje para reescribir la historia oficial fotograma a fotograma.',
    section: 'cine',
    category: 'analisis-de-cine',
    categoryLabel: 'Análisis de Cine',
    author: 'Lucía Bravo',
    date: '10 SEP 2026',
    timeAgo: 'Hace 6 días',
    readingTime: '8 min de lectura',
    image: '/images/cine-analisis.png',
    body: [
      'El montaje siempre ha sido el lugar donde una película se convierte en discurso. Cortar aquí y no allá es una decisión política, y hay una generación de directoras que lo tiene clarísimo.',
      'A través del choque de imágenes, del archivo intervenido y de la superposición, estas cineastas construyen relatos que cuestionan la versión oficial de los hechos.',
      'Es cine de resistencia hecho en la sala de edición, y es de lo más estimulante que se está haciendo ahora mismo.',
    ],
  },
]

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug)
}

export function getFeatured() {
  return articles.find((a) => a.featured) ?? articles[0]
}

export function getBySection(section: Section) {
  return articles.filter((a) => a.section === section)
}

export function getByCategory(category: CategorySlug) {
  return articles.filter((a) => a.category === category)
}

export function getRecent(excludeSlug?: string) {
  return articles.filter((a) => a.slug !== excludeSlug)
}
