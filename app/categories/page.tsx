import type { Metadata } from 'next'
import { ALL_CATEGORIES_QUERY, SETTINGS_QUERY, safeFetch } from '@/lib/sanity'
import { SITE_NAME } from '@/lib/site'
import Link from 'next/link'
import type { Categorie } from '@/lib/types'

export const dynamic = 'force-dynamic'

/* ───────────────────────────────────────────── */
/* 🔥 Dynamic SEO from Sanity                   */
/* ───────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await safeFetch<any>(SETTINGS_QUERY, {}, null)

  const title =
    settings?.categoriesSeoTitle || 'Types de rencontres au Québec – Catégories'
  const description =
    settings?.categoriesSeoDescription ||
    `Choisissez votre type de rencontre au Québec sur ${SITE_NAME} : relation sérieuse, aventure, amitié et plus.`

  return {
    title,
    description,
    alternates: { canonical: '/categories' },
    openGraph: { title, description, url: '/categories' },
  }
}

export default async function CategoriesPage() {
  const cats = await safeFetch<Categorie[]>(ALL_CATEGORIES_QUERY, {}, [])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div
        style={{
          padding: '40px 0 28px',
          background:
            'linear-gradient(135deg,rgba(225,29,72,.06),transparent)',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          marginBottom: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 20px',
          }}
        >
          <span style={{ color: '#3e444d', fontSize: '.78rem' }}>
            <Link href="/" style={{ color: '#7c8590', textDecoration: 'none' }}>Accueil</Link> ›{' '}
            <span style={{ color: '#fb7185' }}>
              Catégories
            </span>
          </span>

          <h1
            style={{
              fontSize: '2.2rem',
              color: 'white',
              marginTop: 8,
              marginBottom: 6,
            }}
          >
            Rencontres selon vos préférences
          </h1>

          <p
            style={{
              color: '#7c8590',
              fontSize: '.9rem',
            }}
          >
            Trouvez la catégorie parfaite pour vous.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 20px 60px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill,minmax(280px,1fr))',
            gap: 16,
          }}
        >
          {cats.map((c) => (
            <Link
              key={c._id}
              href={`/categories/${c.slug.current}`}
              style={{
                background: 'rgba(21,25,32,.85)',
                border:
                  '1px solid rgba(225,29,72,.12)',
                borderRadius: 16,
                padding: 28,
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <div
                style={{
                  fontSize: '2.8rem',
                  marginBottom: 12,
                }}
              >
                {c.emoji}
              </div>

              <div
                style={{
                  fontFamily:
                    "'Playfair Display',serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: 6,
                }}
              >
                {c.nom}
              </div>

              {c.description && (
                <div
                  style={{
                    color: '#7c8590',
                    fontSize: '.83rem',
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  {c.description}
                </div>
              )}

              <span
                style={{
                  fontSize: '.72rem',
                  background:
                    'rgba(225,29,72,.1)',
                  border:
                    '1px solid rgba(225,29,72,.2)',
                  color: '#fb7185',
                  borderRadius: 50,
                  padding: '3px 10px',
                  fontWeight: 700,
                }}
              >
                {c.profileCount || 0} profils
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}