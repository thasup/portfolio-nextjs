'use client';

import { useLocale } from 'next-intl';
import { testimonials } from '@/data/testimonials';
import { getLocalizedData } from '@/components/shared/LocalizedText';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Quote } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';

export function TestimonialModal({ id }: { id: string }) {
  const locale = useLocale();
  const { close } = useModal();
  const testimonial = testimonials.find((t) => t.id === id);

  if (!testimonial) return <div className="p-8 text-center text-muted-foreground">Testimonial not found</div>;

  const quote = getLocalizedData(testimonial, 'quote', locale);
  const authorRole = getLocalizedData(testimonial, 'authorRole', locale);
  const relationship = getLocalizedData(testimonial, 'relationship', locale);

  return (
    <div className="flex flex-col h-full relative p-6 sm:p-8 lg:p-12 items-center justify-center text-center">
      <DialogHeader className="mb-0 flex-col items-center flex-grow flex justify-center w-full max-w-3xl mx-auto">
        
        <Quote className="h-16 w-16 text-primary/20 mb-8" />
        
        <DialogTitle className="text-2xl sm:text-3xl md:text-5xl font-serif italic text-foreground leading-relaxed text-balance mb-12">
          &ldquo;{quote}&rdquo;
        </DialogTitle>
        
        <div className="flex flex-col items-center mt-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-4">
            {getInitials(testimonial.authorName)}
          </div>
          <div className="text-xl font-bold">{testimonial.authorName}</div>
          <div className="text-muted-foreground mt-1">{authorRole}</div>
          <div className="text-sm text-muted-foreground/80 mt-1 uppercase tracking-wider">{relationship}</div>
        </div>
      </DialogHeader>

      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
         <Button variant="ghost" className="hidden" onClick={close}>Close</Button>
      </div>
    </div>
  );
}
