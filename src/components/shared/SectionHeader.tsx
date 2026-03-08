import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  label?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  title,
  subtitle,
  label,
  align = 'center',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center'
      )}
    >
      {label && (
        <span className="mb-3 inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary">
          {label}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
