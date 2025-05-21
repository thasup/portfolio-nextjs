import { Inter } from 'next/font/google';
import { gelasio, openSans } from '@/lib/fonts';
import CustomHeader from '@/components/sections/CustomHeader';
import Footer from '@/components/sections/Footer';

import '@/styles/globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Thanachon Portfolio",
  description: "Software engineer portfolio showcasing projects and skills",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${gelasio.variable} ${openSans.variable}`}>
      <body className={inter.className}>
        <CustomHeader />
        <main className="pb-5">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
