import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SITE_URL } from '@/lib/site'
import { getTexts, fill, uiOnly } from '@/lib/texts'

export const dynamic = 'force-dynamic'

// Everything below comes from Sanity → "🌐 Textes du site"
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts()
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: fill(t.seoHomeTitle, {}, t),
      template: fill(t.seoTitleTemplate, { page: '%s' }, t),
    },
    description: fill(t.seoHomeDescription, {}, t),
    keywords: t.seoKeywords.split(',').map((k) => k.trim()).filter(Boolean),
    alternates: { canonical: '/' },
    openGraph: { siteName: t.siteName, locale: t.ogLocale, type: 'website' },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0f14',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const texts = uiOnly(await getTexts())

  return (
    <html lang={texts.htmlLang}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Figtree:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <Navbar texts={texts} />
        <main>{children}</main>
        <Footer texts={texts} />
      </body>
    </html>
  )
}
