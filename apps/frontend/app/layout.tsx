import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Providers } from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import { CookieBanner } from '@/components/layout/cookie-banner';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Unitree Robotics',
    default: 'Unitree Robotics — Advanced Humanoid Robots',
  },
  description:
    'Enterprise-grade humanoid robots and autonomous systems for research, industry, and exploration.',
  keywords: ['humanoid robot', 'robotics', 'Unitree', 'autonomous', 'AI robot'],
  authors: [{ name: 'Unitree Robotics' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Unitree Robotics',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ScrollProgress />
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
