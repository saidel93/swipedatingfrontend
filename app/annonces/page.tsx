import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ALL_PROFILES_QUERY,
  ALL_CATEGORIES_QUERY,
  SETTINGS_QUERY,
  safeFetch,
  shuffle,
} from '@/lib/sanity'
import ProfileCard from '@/components/ProfileCard'
import type { Profile, Categorie, SiteSettings } from '@/lib/types'

export const dynamic = 'force-dynamic'

type SP = { cat?: string; q?: string }

/* ───────────────────────────────────────────── */
/* SEO                                          */
/* ───────────────────────────────────────────── */

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const settings = await safeFetch<SiteSettings | null>(SETTINGS_QUERY, {}, null)

  let title = settings?.annoncesSeoTitle || 'Toutes les annonces – Célibataires au Québec'
  let description =
    settings?.annoncesSeoDescription ||
    'Parcourez des milliers de profils vérifiés partout au Québec.'

  if (searchParams.q) {
    title = `Recherche "${searchParams.q}" – Annonces Québec`
    description = `Résultats pour "${searchParams.q}" parmi les célibataires du Québec.`
  }

  return {
    title,
    description,
    alternates: { canonical: '/annonces' },
    // Filtered / search pages should not be indexed separately
    robots: searchParams.q || searchParams.cat ? { index: false, follow: true } : undefined,
  }
}

/* ───────────────────────────────────────────── */
/* PAGE                                         */
/* ───────────────────────────────────────────── */

export default async function AnnoncesPage({ searchParams }: { searchParams: SP }) {
  const [allProfiles, cats] = await Promise.all([
    safeFetch<Profile[]>(ALL_PROFILES_QUERY, {}, []),
    safeFetch<Categorie[]>(ALL_CATEGORIES_QUERY, {}, []),
  ])

  let profiles = allProfiles

  if (searchParams.cat) {
    profiles = profiles.filter((p) => p.categorie?.slug?.current === searchParams.cat)
  }

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase().trim()
    profiles = profiles.filter(
      (p) =>
        p.nom?.toLowerCase().includes(q) ||
        p.tagline?.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q) ||
        p.categorie?.nom?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    )
  }

  profiles = shuffle(profiles)

  const activeCat = cats.find((c) => c.slug.current === searchParams.cat)

  const pill = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px',
    borderRadius: 50,
    background: active ? 'rgba(225,29,72,.15)' : 'rgba(255,255,255,.04)',
    border: active ? '1px solid rgba(225,29,72,.35)' : '1px solid rgba(255,255,255,.07)',
    color: active ? '#fb7185' : '#9ba3af',
    fontSize: '.82rem',
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  })

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* HEADER */}
      <div
        style={{
          padding: '36px 0 24px',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          marginBottom: 24,
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '2rem', color: 'white' }}>
            {activeCat ? `${activeCat.emoji ?? ''} ${activeCat.nom}` : 'Toutes les annonces'}
          </h1>

          <p style={{ color: '#7c8590' }}>
            {profiles.length} profil{profiles.length > 1 ? 's' : ''} trouvé
            {profiles.length > 1 ? 's' : ''}
            {searchParams.q ? ` pour « ${searchParams.q} »` : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 60px' }}>
        {/* CATEGORY FILTER (all screen sizes) */}
        {cats.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 24,
            }}
          >
            <Link href="/annonces" style={pill(!searchParams.cat)}>
              Toutes ({allProfiles.length})
            </Link>
            {cats.map((c) => (
              <Link
                key={c._id}
                href={`/annonces?cat=${c.slug.current}`}
                style={pill(searchParams.cat === c.slug.current)}
              >
                {c.emoji} {c.nom} ({c.profileCount || 0})
              </Link>
            ))}
          </div>
        )}

        {/* PROFILES */}
        {profiles.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
              gap: 16,
            }}
          >
            {profiles.map((p) => (
              <ProfileCard key={p._id} p={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#7c8590' }}>
            Aucun profil trouvé.{' '}
            <Link href="/annonces" style={{ color: '#fb7185' }}>
              Voir toutes les annonces
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
