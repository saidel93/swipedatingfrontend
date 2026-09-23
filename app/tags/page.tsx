import type { Metadata } from 'next'
import Link from 'next/link'
import { ALL_CATEGORIES_QUERY, safeFetch } from '@/lib/sanity'
import type { Categorie } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tags : rencontres selon vos préférences',
  description:
    'Explorez les différentes catégories et trouvez le type de rencontre qui vous correspond.',
  alternates: { canonical: '/tags' },
}

export default async function TagsPage() {
  const cats = await safeFetch<Categorie[]>(ALL_CATEGORIES_QUERY, {}, [])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* HEADER */}
      <div
        style={{
          padding: '40px 0 28px',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          marginBottom: 40,
        }}
      >
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '2rem', color: 'white' }}>
            Tags : rencontres selon vos préférences
          </h1>
          <p style={{ color: '#7c8590' }}>
            Trouvez une personne qui offre exactement ce que vous cherchez.
          </p>
        </div>
      </div>

      {/* TAG CARDS */}
      <div
        style={{
          maxWidth: 1300,
          margin: '0 auto',
          padding: '0 20px 80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
          gap: 24,
        }}
      >
        {cats.map((c) => (
          <div
            key={c._id}
            style={{
              background: 'rgba(21,25,32,.8)',
              borderRadius: 18,
              padding: 26,
              border: '1px solid rgba(255,255,255,.05)',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                marginBottom: 18,
                color: 'white',
              }}
            >
              {c.emoji || '❤️'} {c.nom}
            </h3>

            <Link
              href={`/categories/${c.slug.current}`}
              style={{
                display: 'inline-block',
                background:
                  'linear-gradient(135deg,#e11d48,#9f1239)',
                padding: '10px 20px',
                borderRadius: 12,
                color: 'white',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '.85rem',
              }}
            >
              Voir tous les profils →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}