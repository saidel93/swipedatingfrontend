import type { Metadata } from 'next'
import {
  PROFILE_BY_SLUG_QUERY,
  RELATED_PROFILES_QUERY,
  SETTINGS_QUERY,
  safeFetch,
  shuffle,
  profileHref,
  getPhotoSrc,
  getGalleryUrls,
  getAffiliateUrl,
  getProfileMetaTitle,
  getProfileMetaDesc,
} from '@/lib/sanity'
import type { Profile, SiteSettings } from '@/lib/types'
import { notFound } from 'next/navigation'
import ProfileCard from '@/components/ProfileCard'
import EmailGate from '@/components/EmailGate'
import Link from 'next/link'
import { SITE_LOCATION } from '@/lib/site'

export const dynamic = 'force-dynamic'

/* ───────────────────────────────────────────── */
/* 🔥 Dynamic SEO from Sanity                   */
/* ───────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const p = await safeFetch<Profile | null>(PROFILE_BY_SLUG_QUERY, {
      slug: decodeURIComponent(params.slug),
    }, null)

    if (!p) return { title: 'Profil introuvable', robots: { index: false } }

    const title = getProfileMetaTitle(p)
    const description = getProfileMetaDesc(p)
    const image = getPhotoSrc(p)

    const ogAlt = `${p.nom}, ${p.age} ans`
    const ogUrl = profileHref(p)

    const isPlaceholder = image.startsWith('/placeholder')

    return {
      title,
      description,
      alternates: { canonical: ogUrl },
      openGraph: {
        title,
        description,
        type: 'profile',
        url: ogUrl,
        images: isPlaceholder ? undefined : [
          {
            url: image,
            alt: ogAlt,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: isPlaceholder ? undefined : [
          {
            url: image,
            alt: ogAlt,
          },
        ],
      },
    }
  } catch {
    return {
      title: 'Profil',
      description: 'Profil',
    }
  }
}

/* ───────────────────────────────────────────── */
/* PAGE                                         */
/* ───────────────────────────────────────────── */

export default async function ProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const [p, settings] = await Promise.all([
    safeFetch<Profile | null>(PROFILE_BY_SLUG_QUERY, { slug: decodeURIComponent(params.slug) }, null),
    safeFetch<SiteSettings | null>(SETTINGS_QUERY, {}, null),
  ])

  if (!p) notFound()

  const related = await safeFetch<Profile[]>(RELATED_PROFILES_QUERY, { id: p._id }, [])

  const mainPhoto = getPhotoSrc(p, 900, 1120)
  const gallery = getGalleryUrls(p)
  const affLink = getAffiliateUrl(p, settings)

  // Similar profiles: same category first, then others
  const sameCat = shuffle(related.filter((x) => p.categorie?._id && x.categorie?._id === p.categorie._id))
  const others = shuffle(related.filter((x) => !sameCat.includes(x)))
  const similar = [...sameCat, ...others].slice(0, 4)

  const css = `
.wrap{max-width:1200px;margin:0 auto;padding:40px 20px;}
.grid{display:grid;grid-template-columns:1fr;gap:28px;align-items:start;margin-bottom:60px;}
.imgCol{width:100%;}
.heroImg{border-radius:18px;overflow:hidden;aspect-ratio:4/5;margin-bottom:16px;}
.heroImg img{width:100%;height:100%;object-fit:cover;display:block;}
.thumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.thumb{aspect-ratio:1;border-radius:10px;overflow:hidden;}
.thumb img{width:100%;height:100%;object-fit:cover;display:block;}

.title{font-size:clamp(1.7rem,6vw,2.6rem);color:#fff;line-height:1.2;font-family:'Playfair Display',serif;margin:0 0 12px;}
.sub{font-size:1.1rem;font-weight:600;color:#f1f5f9;margin:0 0 20px;}
.quote{border-left:4px solid #e11d48;padding-left:18px;margin:0 0 26px;}
.quote p{font-size:clamp(1rem,4vw,1.25rem);color:rgba(255,255,255,.85);line-height:1.6;font-style:italic;margin:0;}
.bio{font-size:1rem;line-height:1.8;color:#cbd5e1;margin:0 0 30px;white-space:pre-wrap;}

.catLink{color:#fb7185;text-decoration:none;}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 28px;}
.tag{font-size:.8rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#cbd5e1;border-radius:50px;padding:5px 12px;}
.ctaBox{background:rgba(255,255,255,.04);border:1px solid rgba(225,29,72,.25);border-radius:20px;padding:24px;}

.relatedTitle{font-family:'Playfair Display',serif;color:#fff;font-size:1.5rem;margin:0 0 18px;}
.relatedGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;}

@media (min-width:1024px){
.grid{grid-template-columns:420px 1fr;gap:60px;}
.imgCol{max-width:420px;}
.heroImg{aspect-ratio:4/5;}
}
`

  const imgAlt = `${p.nom}, ${p.age} ans`
  const h1Text =
    p.heroTitle || p.tagline || `${p.nom}, ${p.age} ans`

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="wrap">
        <div className="grid">

          {/* IMAGE */}
          <div className="imgCol">
            <div className="heroImg">
              <img src={mainPhoto} alt={imgAlt} fetchPriority="high" />
            </div>

            {gallery.length > 1 && (
              <div className="thumbs">
                {gallery.slice(1, 5).map((src, i) => (
                  <div key={i} className="thumb">
                    <img src={src} alt={`${imgAlt} – photo ${i + 2}`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROFILE INFO */}
          <div>
            <h1 className="title">{h1Text}</h1>

            <div className="sub">
              {p.age} ans · 📍 {SITE_LOCATION}
              {p.categorie ? (
                <>
                  {' '}·{' '}
                  <Link href={`/categories/${p.categorie.slug.current}`} className="catLink">
                    {p.categorie.emoji} {p.categorie.nom}
                  </Link>
                </>
              ) : null}
            </div>

            {p.tagline && (
              <blockquote className="quote">
                <p>"{p.tagline}"</p>
              </blockquote>
            )}

            {p.bio && <p className="bio">{p.bio}</p>}

            {p.tags && p.tags.length > 0 && (
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            )}

            {/* EMAIL GATE CTA */}
            <div className="ctaBox">
              <EmailGate
                affiliateUrl={affLink}
                profileName={p.nom}
                category={p.categorie?.nom}
              />
            </div>
          </div>
        </div>

        {/* RELATED PROFILES */}
        {similar.length > 0 && (
          <div>
            <h3 className="relatedTitle">
              Profils similaires
            </h3>

            <div className="relatedGrid">
              {similar.map((r) => (
                <ProfileCard key={r._id} p={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}