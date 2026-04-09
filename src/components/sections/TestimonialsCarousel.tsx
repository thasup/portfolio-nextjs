'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Pagination, Autoplay, A11y, Keyboard } from 'swiper/modules'
import { type Testimonial } from '@/types/testimonial'
import { Card, CardContent } from '@/components/ui/card'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { useModal } from '@/hooks/useModal'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/a11y'


interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const t = useTranslations('testimonials')
  const { open } = useModal()
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <div className="pb-8 sm:pb-12 lg:pb-16 relative px-8 sm:px-12 lg:px-16">
      <Swiper
        modules={[Pagination, Autoplay, A11y, Keyboard]}
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        spaceBetween={24}
        slidesPerView={1}
        centeredSlides={false}
        loop={true}
        speed={800}
        grabCursor={true}
        roundLengths={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}
        watchOverflow={true}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        touchEventsTarget="wrapper"
        threshold={5}
        resistance={true}
        resistanceRatio={0.5}
        breakpoints={{
          640: { slidesPerView: 1.2, spaceBetween: 16, centeredSlides: true },
          768: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
          1024: { slidesPerView: 2.2, spaceBetween: 24, centeredSlides: false },
          1280: { slidesPerView: 2.5, spaceBetween: 28, centeredSlides: false },
        }}
        className="testimonial-swiper w-full pt-0.5"
      >
        {testimonials.map((testimonial) => {
          const summaryQuote = t(`entries.${testimonial.id}.summaryQuote`)
          const authorRole = t(`entries.${testimonial.id}.authorRole`)
          const relationship = t(`entries.${testimonial.id}.relationship`)
          const proofThemeLabel = t(`entries.${testimonial.id}.proofThemeLabel`)

          return (
            <SwiperSlide key={testimonial.id} className="h-auto flex pb-2">
              <Card
                className="testimonial-card flex h-full flex-col cursor-pointer border-border bg-background transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                onClick={() => open({ type: 'testimonial', id: testimonial.id })}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    open({ type: 'testimonial', id: testimonial.id })
                  }
                }}
                aria-label={`${t('card.ariaLabelRead')} ${testimonial.authorName}, ${authorRole}`}
              >
                <CardContent className="p-8 flex flex-1 flex-col justify-between gap-6 min-h-[280px] md:min-h-[320px]">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <Quote className="h-8 w-8 text-primary/20 shrink-0" />
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                        {proofThemeLabel}
                      </div>
                    </div>
                    
                    <p className="text-lg font-medium leading-relaxed italic">
                      &ldquo;{summaryQuote}&rdquo;
                    </p>
                    
                    <p className="text-sm text-muted-foreground">
                      {t('card.tapToRead')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                      {getInitials(testimonial.authorName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{testimonial.authorName}</div>
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

      {/* Custom Navigation Buttons - Left & Right Side */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="testimonial-nav-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 -translate-x-3 sm:-translate-x-5 lg:-translate-x-8 items-center justify-center rounded-full bg-background/90 border border-border shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-background hover:shadow-xl hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:h-12 lg:w-12"
        aria-label={t('carousel.prevSlide')}
        type="button"
      >
        <ChevronLeft className="h-5 w-5 text-foreground lg:h-6 lg:w-6" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="testimonial-nav-next absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 translate-x-3 sm:translate-x-5 lg:translate-x-8 items-center justify-center rounded-full bg-background/90 border border-border shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-background hover:shadow-xl hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:h-12 lg:w-12"
        aria-label={t('carousel.nextSlide')}
        type="button"
      >
        <ChevronRight className="h-5 w-5 text-foreground lg:h-6 lg:w-6" />
      </button>
    </div>
  )
}
