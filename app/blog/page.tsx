import type { Metadata } from 'next'
import { BLOGS_QUERY, safeFetch } from '@/lib/sanity'
import Link from 'next/link'
import { getTexts, makeT, fill, uiOnly } from '@/lib/texts'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const tx = await getTexts()
  return {
    title: fill(tx.seoBlogTitle, {}, tx),
    description: fill(tx.seoBlogDescription, {}, tx),
    alternates: { canonical: '/blog' },
  }
}

export default async function BlogPage() {
  const [posts, tx] = await Promise.all([safeFetch<any[]>(BLOGS_QUERY, {}, []), getTexts()])
  const t = makeT(uiOnly(tx))

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ padding: '40px 0 28px', background: 'linear-gradient(135deg,rgba(225,29,72,.06),transparent)', borderBottom: '1px solid rgba(255,255,255,.06)', marginBottom: 40 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <span style={{ color: '#3e444d', fontSize: '.78rem' }}><Link href="/" style={{ color: '#7c8590', textDecoration: 'none' }}>{t('breadcrumbHome')}</Link> › <span style={{ color: '#fb7185' }}>{t('blogBreadcrumb')}</span></span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: 'white', marginTop: 8, marginBottom: 6 }}>{t('blogTitle')}</h1>
          <p style={{ color: '#7c8590', fontSize: '.9rem' }}>{t('blogSubtitle')}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 60px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#7c8590' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📝</div>
            <p>{t('blogEmpty')}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {posts.map((post: any) => {
              const img = post.image?.asset?.url || post.imageUrl
              return (
                <Link key={post._id} href={`/blog/${post.slug.current}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 14, overflow: 'hidden', background: 'rgba(21,25,32,.85)', border: '1px solid rgba(255,255,255,.07)' }}>
                  {img && (
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                      <img src={img} alt={post.titre} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '16px 20px' }}>
                    {post.datePublication && <p style={{ color: '#4b5563', fontSize: '.72rem', marginBottom: 6 }}>{new Date(post.datePublication).toLocaleDateString(tx.dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.15rem', color: 'white', marginBottom: 8, lineHeight: 1.3 }}>{post.titre}</h2>
                    {post.extrait && <p style={{ color: '#7c8590', fontSize: '.82rem', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{post.extrait}</p>}
                    <span style={{ display: 'inline-block', marginTop: 12, color: '#fb7185', fontSize: '.8rem', fontWeight: 600 }}>{t('blogReadMore')}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}