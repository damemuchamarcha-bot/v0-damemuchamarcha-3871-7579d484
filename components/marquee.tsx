const ITEMS = [
  'Cine sin filtros',
  'Música a todo volumen',
  'Crítica con criterio',
  'Directos incendiarios',
  'Cultura de barrio',
  'Estrenos de la temporada',
]

export function Marquee() {
  const loop = [...ITEMS, ...ITEMS]
  return (
    <div className="overflow-hidden border-y-2 border-punk-pink bg-punk-yellow py-2.5">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-display text-sm uppercase tracking-[0.2em] text-punk-black">
              {item}
            </span>
            <span className="text-punk-black" aria-hidden="true">
              ★
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
