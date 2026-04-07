'use client';

import { useTranslations } from 'next-intl';
import { testimonials } from '@/data/testimonials';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Quote } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { type Testimonial } from '@/types/testimonial';

export function TestimonialModal({ id }: { id: string }) {
  const t = useTranslations('testimonials');
  const testimonial = testimonials.find((t: Testimonial) => t.id === id);

  if (!testimonial) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t('card.notFound')}
      </div>
    );
  }

  const fullQuote = t(`entries.${testimonial.id}.fullQuote`);
  const authorRole = t(`entries.${testimonial.id}.authorRole`);
  const relationship = t(`entries.${testimonial.id}.relationship`);
  const proofThemeLabel = t(`entries.${testimonial.id}.proofThemeLabel`);
  // Note: contextNote is optional and might need a t.has() check if added in JSON later
  // For now let's assume it's optional in JSON too but not added yet
  const contextNote = t.has(`entries.${testimonial.id}.contextNote`) ? t(`entries.${testimonial.id}.contextNote`) : null;

  // Split quote by double newlines to preserve paragraph structure
  const paragraphs = fullQuote.split('\n\n').filter((p: string) => p.trim());

  return (
    <div className="flex flex-col h-full relative p-6 sm:p-8 lg:p-12 overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto">
        <DialogHeader className="mb-8 flex-col items-center text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Quote className="h-10 w-10 text-primary/20" />
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
              {proofThemeLabel}
            </div>
          </div>
          
          <DialogTitle className="sr-only">
            {t('card.modalTitle')} {testimonial.authorName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mb-10 px-4">
          {paragraphs.map((paragraph: string, index: number) => (
            <p 
              key={index}
              className="text-base sm:text-lg md:text-xl font-serif leading-relaxed text-foreground text-left"
            >
              {index === 0 && <span className="text-3xl text-primary/40 mr-1">&ldquo;</span>}
              {paragraph}
              {index === paragraphs.length - 1 && <span className="text-3xl text-primary/40 ml-1">&rdquo;</span>}
            </p>
          ))}
        </div>

        {contextNote && (
          <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground italic text-center">
              {contextNote}
            </p>
          </div>
        )}

        <div className="flex flex-col items-center pt-8 border-t border-border/50">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-4">
            {getInitials(testimonial.authorName)}
          </div>
          <div className="text-xl font-bold text-center">{testimonial.authorName}</div>
          <div className="text-base text-muted-foreground mt-2 text-center">{authorRole}</div>
          {testimonial.company && (
            <div className="text-sm text-muted-foreground/80 mt-1 text-center">{testimonial.company}</div>
          )}
          <div className="text-sm text-muted-foreground/70 mt-1 uppercase tracking-wider text-center">
            {relationship}
          </div>
        </div>
      </div>
    </div>
  );
}
