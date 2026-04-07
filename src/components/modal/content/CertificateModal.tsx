import { useTranslations } from 'next-intl';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import Image from 'next/image';
import { certificates } from '@/data/certificates';

export function CertificateModal({ id }: { id: string }) {
  const t = useTranslations('certificates');
  const { close } = useModal();
  const cert = certificates.find((c) => c.id === id);

  if (!cert) return <div className="p-8 text-center text-muted-foreground">{t('modal.notFound')}</div>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const title = t(cert.titleKey as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const date = t(cert.dateKey as any);

  return (
    <div className="flex flex-col h-full relative p-6 sm:p-8 lg:p-10">
      <DialogHeader className="mb-0 border-b border-border pb-6 flex-row items-start justify-between">
        <div className="flex items-start gap-4 flex-grow">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary mt-1">
             <Award className="w-7 h-7" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">{cert.issuer}</div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
               <ShieldCheck className="w-4 h-4 text-green-500" />
               <span>{t('modal.issued', { date })}</span>
            </div>
          </div>
        </div>
      </DialogHeader>

      <div className="py-8 flex-grow flex flex-col items-center justify-center">
         <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto rounded-lg border border-border shadow-sm overflow-hidden bg-muted">
            <Image 
              src={cert.image} 
              alt={title} 
              fill 
              className="object-cover opacity-80" 
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full font-medium text-muted-foreground shadow-sm">
                   Placeholder Art
                </div>
            </div>
         </div>
      </div>
      
      <div className="mt-4 pt-6 flex justify-between items-center sm:justify-end gap-3 w-full">
         <Button variant="outline" onClick={close}>
            {t('modal.close')}
         </Button>
         <Button onClick={() => window.open(cert.url, '_blank')} disabled={cert.url === '#'}>
            {t('modal.verify')}
         </Button>
      </div>
    </div>
  );
}
