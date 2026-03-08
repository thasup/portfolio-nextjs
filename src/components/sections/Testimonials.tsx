'use client'

import { SectionHeader } from '@/components/shared/SectionHeader'
import { testimonials } from '@/data/testimonials'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

// Dynamic import with SSR disabled per the constitution to avoid Swiper hydration mismatch
const TestimonialCarousel = dynamic(
  () => import('./TestimonialsCarousel').then(mod => mod.TestimonialCarousel),
  { 
    ssr: false, 
    loading: () => (
      <Card className="h-64 flex items-center justify-center animate-pulse bg-muted/50 border-border">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading testimonials...</p>
        </CardContent>
      </Card>
    )
  }
)

export function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label="TESTIMONIALS"
          title="What People Say"
          subtitle="Feedback from colleagues, managers, and collaborators"
        />
        
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
