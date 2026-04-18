import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Cursor from '@/components/Cursor';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import GlobalReveal from '@/components/GlobalReveal';
import BgScene from '@/components/BgScene';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--serif',
});
const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--sans',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--mono',
});

export const metadata: Metadata = {
  title: 'Anupam Singh — Software Engineer',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <Loader />
        <BgScene />
        <Navbar />
        <Cursor />
        <GlobalReveal />
        {children}
      </body>
    </html>
  );
}
