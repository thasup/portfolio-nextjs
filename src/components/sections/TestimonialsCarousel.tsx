'use client'

import { useLocale } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, A11y } from 'swiper/modules'
import { type Testimonial } from '@/types/testimonial'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { useModal } from '@/hooks/useModal'
import { getLocalizedData } from '@/components/shared/LocalizedText'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/a11y'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const locale = useLocale()
  const { open } = useModal()

  return (
    <div className="pb-12">
      <Swiper
        modules={[Pagination, Autoplay, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 6000, disableOnInteraction: true }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        }}
        className="w-full"
      >
        {testimonials.map((testim) => {
          const summaryQuote = getLocalizedData(testim, 'summaryQuote', locale)
          const authorRole = getLocalizedData(testim, 'authorRole', locale)
          const relationship = getLocalizedData(testim, 'relationship', locale)
          const proofThemeLabel = getLocalizedData(testim, 'proofThemeLabel', locale)

          return (
            <SwiperSlide key={testim.id} className="h-auto">
              <Card
                className="h-full cursor-pointer border-border bg-background transition-colors hover:border-primary/40"
                onClick={() => open({ type: 'testimonial', id: testim.id })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    open({ type: 'testimonial', id: testim.id })
                  }
                }}
                aria-label={`${locale === 'th' ? 'อ่านคำรับรองเต็มจาก' : 'Read full testimonial from'} ${testim.authorName}, ${authorRole}`}
              >
                <CardContent className="p-8 flex flex-col justify-between h-full gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <Quote className="h-8 w-8 text-primary/20 shrink-0" />
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                        {proofThemeLabel}
                      </div>
                    </div>
                    
                    <p className="text-lg font-medium leading-relaxed">
                      &ldquo;{summaryQuote}&rdquo;
                    </p>
                    
                    <p className="text-sm text-muted-foreground">
                      {locale === 'th' ? 'แตะเพื่ออ่านข้อความเต็ม' : 'Tap to read the full quote'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                      {getInitials(testim.authorName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{testim.authorName}</div>
                      <div className="text-sm text-muted-foreground truncate">{authorRole}</div>
                      <div className="text-xs text-muted-foreground/80 truncate">{relationship}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
