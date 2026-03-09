'use client';

import { useLocale } from 'next-intl';

interface LocalizedTextProps {
  en: string;
  th?: string;
  fallback?: string;
}

export function LocalizedText({ en, th, fallback = '' }: LocalizedTextProps) {
  const locale = useLocale();
  if (locale === 'th' && th) {
    return <>{th}</>;
  }
  return <>{en || fallback}</>;
}

export function getLocalizedData<T extends Record<string, any>>(obj: T, fieldName: string, locale: string): string {
  const isThai = locale === 'th';
  if (isThai) {
    const thValue = (obj as any)[`${String(fieldName)}Th`];
    if (thValue) return thValue;
  }
  return (obj as any)[`${String(fieldName)}En`] || '';
}
