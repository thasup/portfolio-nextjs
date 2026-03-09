'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, A11y } from 'swiper/modules'
import { type Testimonial } from '@/types/testimonial'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'
import { getInitials } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/a11y'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  return (
    // Add negative horizontal margin strictly for the padding so bullets sit outside the card neatly
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
        {testimonials.map((testim) => (
          <SwiperSlide key={testim.id} className="h-auto">
            <Card className="h-full border-border bg-background">
              <CardContent className="p-8 flex flex-col justify-between h-full">
                <div>
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-foreground leading-relaxed italic relative z-10">
                    "{testim.quoteEn}"
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-4">
                  {/* Using standard avatar fallback visually as required */}
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                    {getInitials(testim.authorName)}
                  </div>
                  <div>
                    <div className="font-semibold">{testim.authorName}</div>
                    <div className="text-sm text-muted-foreground">{testim.authorRoleEn}</div>
                    <div className="text-xs text-muted-foreground">{testim.relationshipEn}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
