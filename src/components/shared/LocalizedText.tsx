'use client';

import { useLocale } from 'next-intl';
import { locales } from '@/i18n/request';

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

type LocalizedRecord = Record<string, string | undefined>;

export function getLocalizedData<T extends object>(obj: T, fieldName: string, locale: string): string {
  const normalizedLocale = locales.includes(locale as (typeof locales)[number]) ? locale : 'en';
  const isThai = normalizedLocale === 'th';
  const localizedRecord = obj as LocalizedRecord;
  if (isThai) {
    const thValue = localizedRecord[`${String(fieldName)}Th`];
    if (thValue) return thValue;
  }
  return localizedRecord[`${String(fieldName)}En`] || '';
}
