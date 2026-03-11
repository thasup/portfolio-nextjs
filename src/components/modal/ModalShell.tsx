'use client';

import { useModal } from '@/hooks/useModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProjectModal } from './content/ProjectModal';
import { TimelineModal } from './content/TimelineModal';
import { CertificateModal } from './content/CertificateModal';
import { TestimonialModal } from './content/TestimonialModal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { DialogTitle } from '@radix-ui/react-dialog';

export function ModalShell() {
  const { isOpen, close, payload } = useModal();

  if (!payload) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-5xl h-[90vh] sm:h-[85vh] p-0 overflow-y-auto overflow-x-hidden gap-0 bg-background/95 backdrop-blur-md">
        <VisuallyHidden>
          <DialogTitle>Details Modal</DialogTitle>
        </VisuallyHidden>

        <div className="w-full flex-grow relative overflow-auto rounded-b-lg">
          {payload.type === 'project' && <ProjectModal id={payload.id} />}
          {payload.type === 'timeline-event' && <TimelineModal id={payload.id} />}
          {payload.type === 'certificate' && <CertificateModal id={payload.id as 'aws-ccp' | 'toeic'} />}
          {payload.type === 'testimonial' && <TestimonialModal id={payload.id} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
