import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/providers/supabase.provider';
import { LanguageProvider } from '@/providers/language.provider';

// Outfit font - similar to Neuething Sans (modern, clean, geometric)
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GaloDev',
  description: 'Desarrollo de software a medida | Custom software development',
  icons: {
    icon: '/images/hero-bitmoji.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <SupabaseProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
