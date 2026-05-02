"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, A11y } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface ProjectGalleryProps {
  images: string[];
  altText: string;
}

export function ProjectGallery({ images, altText }: ProjectGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted">
      <Swiper
        modules={[Pagination, Navigation, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        className="aspect-video w-full"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={img} className="relative h-full w-full">
            <Image
              src={img}
              alt={`${altText} screenshot ${idx + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
