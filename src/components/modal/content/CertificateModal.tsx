'use client';

import { useLocale } from 'next-intl';
import { getLocalizedData, LocalizedText } from '@/components/shared/LocalizedText';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import Image from 'next/image';

const mockCerts = {
  'aws-ccp': {
    issuer: 'Amazon Web Services',
    titleEn: 'AWS Certified Cloud Practitioner',
    titleTh: 'ผู้ดูแลระบบคลาวด์รับรองโดย AWS',
    date: 'August 2023',
    url: 'https://aws.amazon.com/certification/',
    image: '/images/cert-placeholder.webp',
  },
  'toeic': {
    issuer: 'ETS',
    titleEn: 'TOEIC Listening and Reading - Score: 990',
    titleTh: 'พนักงาน TOEIC - คะแนน: 990',
    date: 'January 2024',
    url: '#',
    image: '/images/cert-placeholder.webp',
  }
}

export function CertificateModal({ id }: { id: 'aws-ccp' | 'toeic' }) {
  const locale = useLocale();
  const { close } = useModal();
  const cert = mockCerts[id];

  if (!cert) return <div className="p-8 text-center text-muted-foreground">Certificate not found</div>;

  const title = getLocalizedData(cert, 'title', locale);

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
               <LocalizedText en={`Issued: ${cert.date}`} th={`ออกเมื่อ: ${cert.date}`} />
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
            <LocalizedText en="Close" th="ปิด" />
         </Button>
         <Button onClick={() => window.open(cert.url, '_blank')} disabled={cert.url === '#'}>
            <LocalizedText en="Verify Credential" th="ตรวจสอบข้อมูลยืนยัน" />
         </Button>
      </div>
    </div>
  );
}
