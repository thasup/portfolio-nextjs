import '@/styles/globals.scss';
import { Inter } from 'next/font/google';
import CustomHeader from '@/components/sections/CustomHeader';
import Footer from '@/components/sections/Footer';

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
    <html lang="en">
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
