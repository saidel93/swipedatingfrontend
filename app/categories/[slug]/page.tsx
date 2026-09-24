import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  PROFILES_BY_CAT_QUERY,
  ALL_CATEGORIES_QUERY,
  CAT_BY_SLUG_QUERY,
  safeFetch,
} from '@/lib/sanity'
import ProfileCard from '@/components/ProfileCard'
import { getTexts, makeT, fill, uiOnly } from '@/lib/texts'
import type { Profile, Categorie } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Params = { slug: string }

/* ───────────────────────────────────────────── */
/* SEO                                          */
/* ───────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const [cat, tx] = await Promise.all([
    safeFetch<Categorie | null>(CAT_BY_SLUG_QUERY, { slug: params.slug }, null),
    getTexts(),
  ])
  if (!cat) return { title: fill(tx.notFoundTitle, {}, tx), robots: { index: false } }

  const title = cat.seoTitle || fill(tx.seoCategoryTitle, { category: cat.nom, emoji: cat.emoji ?? '' }, tx)
  const description =
    cat.seoDescription || cat.description || fill(tx.seoCategoryDescription, { category: cat.nom }, tx)
  const url = `/categories/${params.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  }
}

/* ───────────────────────────────────────────── */
/* PAGE                                         */
/* ───────────────────────────────────────────── */

export default async function CategoryPage({ params }: { params: Params }) {
  const [profiles, cat, allCats] = await Promise.all([
    safeFetch<Profile[]>(PROFILES_BY_CAT_QUERY, { catSlug: params.slug }, []),
    safeFetch<Categorie | null>(CAT_BY_SLUG_QUERY, { slug: params.slug }, null),
    safeFetch<Categorie[]>(ALL_CATEGORIES_QUERY, {}, []),
  ])
  const texts = uiOnly(await getTexts())
  const t = makeT(texts)

  if (!cat) notFound()

  const otherCats = allCats.filter((c) => c._id !== cat._id)

  const pill: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 50,
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.07)',
    color: '#9ba3af',
    fontSize: '.83rem',
    fontWeight: 600,
    textDecoration: 'none',
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* HEADER */}
      <div
        style={{
          padding: '40px 0 28px',
          background: 'linear-gradient(135deg,rgba(225,29,72,.06),transparent)',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          marginBottom: 32,
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <span style={{ color: '#3e444d', fontSize: '.78rem' }}>
            <Link href="/" style={{ color: '#7c8590', textDecoration: 'none' }}>
              {t('breadcrumbHome')}
            </Link>{' '}
            ›{' '}
            <Link href="/categories" style={{ color: '#7c8590', textDecoration: 'none' }}>
              {t('categoriesBreadcrumb')}
            </Link>{' '}
            › <span style={{ color: '#fb7185' }}>{cat.nom}</span>
          </span>

          <h1 style={{ fontSize: '2.2rem', color: 'white', marginTop: 8, marginBottom: 6 }}>
            {cat.emoji} {cat.nom}
          </h1>

          {cat.description && (
            <p style={{ color: '#7c8590', fontSize: '.9rem' }}>{cat.description}</p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 60px' }}>
        {/* TOP SEO CONTENT */}
        {cat.topContent && (
          <div
            style={{
              marginBottom: 40,
              fontSize: '1rem',
              lineHeight: 1.8,
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap',
            }}
          >
            {cat.topContent}
          </div>
        )}

        {/* PROFILES GRID */}
        <p style={{ color: 'white', fontWeight: 600, marginBottom: 20 }}>
          {t(profiles.length === 1 ? 'countOne' : 'countMany', { count: profiles.length })}
        </p>

        {profiles.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
              gap: 18,
            }}
          >
            {profiles.map((p) => (
              <ProfileCard key={p._id} p={p} texts={texts} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#7c8590' }}>
            {t('categoryEmpty')}
          </div>
        )}

        {/* OTHER CATEGORIES */}
        {otherCats.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div
              style={{
                color: '#7c8590',
                fontSize: '.72rem',
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              {t('categoryOthers')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {otherCats.map((c) => (
                <Link key={c._id} href={`/categories/${c.slug.current}`} style={pill}>
                  {c.emoji} {c.nom} ({c.profileCount || 0})
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM SEO CONTENT */}
        {cat.bottomContent && (
          <div
            style={{
              marginTop: 60,
              paddingTop: 40,
              borderTop: '1px solid rgba(255,255,255,.08)',
              fontSize: '1rem',
              lineHeight: 1.9,
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap',
            }}
          >
            <h2 style={{ color: 'white', marginBottom: 16 }}>{t('categoryAbout', { category: cat.nom })}</h2>
            {cat.bottomContent}
          </div>
        )}
      </div>
    </div>
  )
}
