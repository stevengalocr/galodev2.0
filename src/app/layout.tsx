import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/providers/language.provider';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
