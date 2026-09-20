import type { Section } from '@/lib/articles'

export function CategoryTag({
  label,
  section,
  className = '',
}: {
  label: string
  section: Section
  className?: string
}) {
  const color =
    section === 'cine'
      ? 'bg-punk-pink text-punk-black'
      : 'bg-punk-yellow text-punk-black'
  return (
    <span
      className={`inline-block font-display text-[11px] uppercase leading-none tracking-[0.15em] ${color} px-2 py-1.5 ${className}`}
    >
      {label}
    </span>
  )
}
