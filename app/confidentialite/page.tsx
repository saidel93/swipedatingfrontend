import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { getTexts, fill, uiOnly } from '@/lib/texts'

export const dynamic = 'force-dynamic'

// Texts: Sanity → "🌐 Textes du site" → ⚖️ Pages légales
export async function generateMetadata(): Promise<Metadata> {
  const tx = await getTexts()
  return {
    title: fill(tx.privacyTitle, {}, tx),
    description: fill(tx.seoPrivacyDescription, {}, tx),
    alternates: { canonical: '/confidentialite' },
  }
}

export default async function PrivacyPage() {
  const tx = await getTexts()
  const texts = uiOnly(tx)
  return (
    <LegalPage
      title={fill(tx.privacyTitle, {}, tx)}
      intro={fill(tx.privacyIntro, {}, tx)}
      content={tx.privacyContent}
      texts={texts}
    />
  )
}
