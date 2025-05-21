import { Gelasio, Open_Sans } from 'next/font/google';

export const gelasio = Gelasio({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-gelasio',
  display: 'swap',
});

export const openSans = Open_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});
