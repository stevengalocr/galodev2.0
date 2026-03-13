import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/providers/language.provider';

// Outfit font - similar to Neuething Sans (modern, clean, geometric)
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GaloDev | Desarrollador Full Stack',
  description:
    'Portafolio profesional de Steven Galo. Desarrollo de software a medida, aplicaciones web y móviles. Custom software development.',
  keywords:
    'desarrollo de software, full stack developer, programador, costa rica, galodev, react, nextjs, aplicaciones web, freelance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
