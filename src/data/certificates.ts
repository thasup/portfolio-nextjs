import type { Certificate } from '@/types/certificate';

export const certificates: Certificate[] = [
  {
    id: 'aws-ccp',
    issuer: 'Amazon Web Services',
    titleKey: 'certificates.aws-ccp.title',
    dateKey: 'certificates.aws-ccp.date',
    url: 'https://aws.amazon.com/certification/',
    image: '/images/cert-placeholder.webp',
  },
  {
    id: 'toeic',
    issuer: 'ETS',
    titleKey: 'certificates.toeic.title',
    dateKey: 'certificates.toeic.date',
    url: '#',
    image: '/images/cert-placeholder.webp',
  }
];
