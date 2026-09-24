import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { getTexts, fill, uiOnly } from '@/lib/texts'

export const dynamic = 'force-dynamic'

// Texts: Sanity → "🌐 Textes du site" → ⚖️ Pages légales
export async function generateMetadata(): Promise<Metadata> {
  const tx = await getTexts()
  return {
    title: fill(tx.conditionsTitle, {}, tx),
    description: fill(tx.seoConditionsDescription, {}, tx),
    alternates: { canonical: '/conditions' },
  }
}

export default async function ConditionsPage() {
  const tx = await getTexts()
  const texts = uiOnly(tx)
  return (
    <LegalPage
      title={fill(tx.conditionsTitle, {}, tx)}
      intro={fill(tx.conditionsIntro, {}, tx)}
      content={tx.conditionsContent}
      texts={texts}
    />
  )
}
