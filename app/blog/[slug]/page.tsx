import type { Metadata } from 'next'
import { BLOG_BY_SLUG_QUERY, safeFetch } from '@/lib/sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getTexts, makeT, fill, uiOnly } from '@/lib/texts'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const [post, tx] = await Promise.all([safeFetch<any>(BLOG_BY_SLUG_QUERY, { slug: params.slug }, null), getTexts()])
    if (!post) return { title: fill(tx.notFoundTitle, {}, tx), robots: { index: false } }
    const title = post.seoTitle || post.titre
    const desc  = post.seoDescription || post.extrait || ''
    const url = `/blog/${params.slug}`
    return { title, description: desc, alternates: { canonical: url }, openGraph: { title, description: desc, url, type: 'article' } }
  } catch (e) { return { title: 'Article' } }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, tx] = await Promise.all([safeFetch<any>(BLOG_BY_SLUG_QUERY, { slug: params.slug }, null), getTexts()])
  if (!post) notFound()
  const t = makeT(uiOnly(tx))

  const img = post.image?.asset?.url || post.imageUrl

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ color: '#3e444d', fontSize: '.78rem', marginBottom: 28, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#7c8590', textDecoration: 'none' }}>{t('breadcrumbHome')}</Link> ›
          <Link href="/blog" style={{ color: '#7c8590', textDecoration: 'none' }}>{t('blogBreadcrumb')}</Link> ›
          <span style={{ color: '#fb7185' }}>{post.titre}</span>
        </div>

        {post.datePublication && (
          <p style={{ color: '#4b5563', fontSize: '.78rem', marginBottom: 10 }}>
            {new Date(post.datePublication).toLocaleDateString(tx.dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}

        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: 'white', lineHeight: 1.2, marginBottom: 20 }}>{post.titre}</h1>

        {post.extrait && (
          <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7, marginBottom: 28, fontStyle: 'italic', borderLeft: '3px solid #e11d48', paddingLeft: 14 }}>{post.extrait}</p>
        )}

        {img && (
          <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 32, aspectRatio: '16/9' }}>
            <img src={img} alt={post.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {post.contenu && (
          <div className="prose-blog" style={{ color: '#9ca3af', fontSize: '.95rem', lineHeight: 1.9 }}>
            <PortableText value={post.contenu} />
          </div>
        )}

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <Link href="/blog" style={{ color: '#fb7185', textDecoration: 'none', fontSize: '.85rem', fontWeight: 600 }}>{t('blogBack')}</Link>
        </div>
      </div>
    </div>
  )
}