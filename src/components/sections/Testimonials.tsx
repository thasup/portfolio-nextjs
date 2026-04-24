'use client'

import { SectionHeader } from '@/components/shared/SectionHeader'
import { testimonials } from '@/data/testimonials'
import dynamic from 'next/dynamic'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Testimonials() {
  const t = useTranslations('testimonials')

  // Dynamic import with SSR disabled per the constitution to avoid Swiper hydration mismatch
  const TestimonialCarousel = dynamic(
    () => import('./TestimonialsCarousel').then(mod => mod.TestimonialCarousel),
    { 
      ssr: false, 
      loading: () => (
        <div className="card h-64 flex flex-col items-center justify-center animate-pulse gap-4 py-8 bg-[var(--color-paper-2)] border-[var(--color-line-soft)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-ink-3)]" />
          <p className="text-sm text-[var(--color-ink-3)]">{t('loading')}</p>
        </div>
      )
    }
  )

  return (
    <section id="testimonials" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />
        
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
