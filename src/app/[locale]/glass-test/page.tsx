import { GlassThemeTest } from '@/components/glass/GlassThemeTest';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });

  return {
    title: `Liquid Glass Test | ${t('menu_title')}`,
  };
}

export default function GlassTestPage() {
  return (
    <main className="container mx-auto py-20">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Liquid Glass System</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Testing ground for glassmorphism effects, liquid distortion, and specular highlights.
          This page demonstrates the capabilities of the enhanced glass system.
        </p>
      </div>
      <GlassThemeTest />
    </main>
  );
}
