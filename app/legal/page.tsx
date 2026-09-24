import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { getTexts, fill, uiOnly } from '@/lib/texts'

export const dynamic = 'force-dynamic'

// Texts: Sanity → "🌐 Textes du site" → ⚖️ Pages légales
export async function generateMetadata(): Promise<Metadata> {
  const tx = await getTexts()
  return {
    title: fill(tx.legalTitle, {}, tx),
    description: fill(tx.seoLegalDescription, {}, tx),
    alternates: { canonical: '/legal' },
  }
}

export default async function LegalInfoPage() {
  const tx = await getTexts()
  const texts = uiOnly(tx)
  return (
    <LegalPage
      title={fill(tx.legalTitle, {}, tx)}
      intro={fill(tx.legalIntro, {}, tx)}
      content={tx.legalContent}
      texts={texts}
    />
  )
}
