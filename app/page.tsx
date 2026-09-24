import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ALL_PROFILES_QUERY,
  SETTINGS_QUERY,
  getPhotoSrc,
  getAffiliateUrl,
  profileHref,
  safeFetch,
  shuffle,
} from '@/lib/sanity'
import SwipeDeck, { type SwipeCard } from '@/components/SwipeDeck'
import type { Profile, SiteSettings } from '@/lib/types'
import { getTexts, makeT, fill, uiOnly } from '@/lib/texts'

export const dynamic = 'force-dynamic'

/** How many profiles are loaded in the swipe deck */
const DECK_SIZE = 40

export async function generateMetadata(): Promise<Metadata> {
  const tx = await getTexts()
  const title = fill(tx.seoHomeTitle, {}, tx)
  const description = fill(tx.seoHomeDescription, {}, tx)
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/' },
    openGraph: { title, description, url: '/' },
  }
}

export default async function HomePage() {
  const [profiles, settings, tx] = await Promise.all([
    safeFetch<Profile[]>(ALL_PROFILES_QUERY, {}, []),
    safeFetch<SiteSettings | null>(SETTINGS_QUERY, {}, null),
    getTexts(),
  ])
  const texts = uiOnly(tx)
  const t = makeT(texts)

  // Featured ("vedette") profiles first, then everyone else — all shuffled
  const featured = shuffle(profiles.filter((p) => p.vedette))
  const rest = shuffle(profiles.filter((p) => !p.vedette))

  const cards: SwipeCard[] = [...featured, ...rest].slice(0, DECK_SIZE).map((p) => ({
    id: p._id,
    href: profileHref(p),
    name: p.nom,
    age: p.age,
    tagline: p.tagline,
    photo: getPhotoSrc(p, 600, 800),
    category: p.categorie?.nom,
    emoji: p.categorie?.emoji,
    online: p.online,
    verified: p.verifie?.photo,
    affiliateUrl: getAffiliateUrl(p, settings),
  }))

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 55% at 10% 15%, rgba(225,29,72,.1) 0%, transparent 55%)',
        }}
      />

      {/* HERO (compact, so the swipe is visible right away on phones) */}
      <section className="home-hero" style={{ padding: '26px 0 18px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(1.7rem,4.5vw,2.6rem)',
              fontWeight: 700,
              marginBottom: 8,
              color: 'white',
              lineHeight: 1.2,
            }}
          >
            {t('heroTitle')}{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#fb7185,#e11d48,#c9913a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontStyle: 'italic',
              }}
            >
              {t('heroHighlight')}
            </span>
          </h1>
          <p style={{ maxWidth: 520, margin: '0 auto', color: '#7c8590' }}>
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* SWIPE */}
      <section style={{ padding: '6px 20px 50px', position: 'relative', zIndex: 1 }}>
        {cards.length > 0 ? (
          <SwipeDeck cards={cards} totalProfiles={profiles.length} texts={texts} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#7c8590' }}>
            {t('homeEmpty')}
          </div>
        )}

        {/* Where to find all profiles */}
        <div className="all-profiles-note">
          <span>{t('allProfilesNote', { count: profiles.length })}</span>
          <Link href="/annonces">{t('allProfilesButton')}</Link>
        </div>
      </section>
    </div>
  )
}
