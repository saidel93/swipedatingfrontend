import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SiteSettings } from './types'
import { fill, type UiTexts } from './fill'

/* ───────────────────────────────────────────── */
/* SANITY CLIENT (read-only, always fresh)       */
/* ───────────────────────────────────────────── */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  console.error(
    '❌ NEXT_PUBLIC_SANITY_PROJECT_ID is missing. Add it to .env.local (local) or to Netlify environment variables.'
  )
}

export const client = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // always fetch fresh content
  perspective: 'published', // only published documents
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)

/* ───────────────────────────────────────────── */
/* IMAGE HELPERS                                */
/* Uploaded image first, then URL, then placeholder */
/* ───────────────────────────────────────────── */

export const PLACEHOLDER_IMG = '/placeholder.svg'

export function getPhotoSrc(profile: any, w = 400, h = 500): string {
  if (profile?.photo?.asset?._ref) {
    return urlFor(profile.photo).width(w).height(h).fit('crop').auto('format').url()
  }
  if (profile?.photoUrl) return profile.photoUrl
  return PLACEHOLDER_IMG
}

/** Main photo + gallery, without duplicates (index 0 = main photo). */
export function getGalleryUrls(profile: any, size = 600): string[] {
  const uploaded: string[] = (profile?.photos || [])
    .filter((p: any) => p?.asset?._ref)
    .map((p: any) => urlFor(p).width(size).height(size).fit('crop').auto('format').url())

  const byUrl: string[] = (profile?.photosUrls || [])
    .map((p: any) => p?.url)
    .filter(Boolean)

  const gallery = uploaded.length ? uploaded : byUrl
  const main = getPhotoSrc(profile, size, size)
  const all = main === PLACEHOLDER_IMG ? gallery : [main, ...gallery]

  return Array.from(new Set(all))
}

/* ───────────────────────────────────────────── */
/* AFFILIATE                                    */
/* ───────────────────────────────────────────── */

export function getAffiliateUrl(profile: any, settings: SiteSettings | null): string {
  return profile?.affiliateUrl || settings?.affiliateUrl || '#'
}

/* ───────────────────────────────────────────── */
/* SEO HELPERS                                  */
/* ───────────────────────────────────────────── */

function firstWords(text: string, n = 20): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  const words = clean.split(' ')
  const out = words.slice(0, n).join(' ')
  return words.length > n ? out + '…' : out
}

export function getProfileMetaTitle(profile: any, texts: UiTexts): string {
  if (profile?.seoTitle) return profile.seoTitle
  if (profile?.heroTitle) return profile.heroTitle
  if (profile?.tagline) return profile.tagline.slice(0, 70)
  return fill(texts.seoProfileTitle, { name: profile?.nom || '', age: profile?.age ?? '' }, texts)
}

export function getProfileMetaDesc(profile: any, texts: UiTexts): string {
  if (profile?.seoDescription) return profile.seoDescription
  if (profile?.bio) return firstWords(profile.bio, 20)
  if (profile?.tagline) return profile.tagline
  return fill(texts.seoProfileDescription, { name: profile?.nom || '' }, texts)
}

/* ───────────────────────────────────────────── */
/* COMMON PROFILE FIELDS                        */
/* ───────────────────────────────────────────── */

const PROFILE_FIELDS = `
  _id,
  slug,
  nom,
  age,
  categorie->{_id, nom, slug, emoji},
  tagline,
  heroTitle,
  seoTitle,
  seoDescription,
  bio,
  photo,
  photos,
  photoUrl,
  photosUrls,
  verifie,
  online,
  vedette,
  membreDepuis,
  derniereActivite,
  tags,
  affiliateUrl
`

/* ───────────────────────────────────────────── */
/* PROFILE QUERIES                              */
/* ───────────────────────────────────────────── */

/** Link to a profile — profiles without a slug still get a page (by _id). */
export function profileHref(p: { slug?: { current?: string }; _id: string }): string {
  return `/profil/${encodeURIComponent(p?.slug?.current || p._id)}`
}

export const ALL_PROFILES_QUERY = `
  *[_type == "profile"]
  | order(_createdAt desc){
    ${PROFILE_FIELDS}
  }
`

export const FEATURED_QUERY = `
  *[_type == "profile" && vedette == true]
  | order(_createdAt desc)[0...24]{
    ${PROFILE_FIELDS}
  }
`

export const PROFILE_BY_SLUG_QUERY = `
  *[_type == "profile" && (slug.current == $slug || _id == $slug)][0]{
    ${PROFILE_FIELDS}
  }
`

export const PROFILES_BY_CAT_QUERY = `
  *[_type == "profile" && categorie->slug.current == $catSlug]
  | order(_createdAt desc){
    ${PROFILE_FIELDS}
  }
`

/** Other profiles for the "similar profiles" block. */
export const RELATED_PROFILES_QUERY = `
  *[_type == "profile" && _id != $id]
  | order(_createdAt desc)[0...60]{
    ${PROFILE_FIELDS}
  }
`

/* ───────────────────────────────────────────── */
/* CATEGORIES                                   */
/* ───────────────────────────────────────────── */

export const ALL_CATEGORIES_QUERY = `
  *[_type == "categorie" && defined(slug.current)]
  | order(nom asc){
    _id,
    nom,
    slug,
    emoji,
    description,
    seoTitle,
    seoDescription,
    "profileCount": count(
      *[_type == "profile" && categorie._ref == ^._id]
    )
  }
`

export const CAT_BY_SLUG_QUERY = `
  *[_type == "categorie" && slug.current == $slug][0]{
    _id,
    nom,
    slug,
    emoji,
    description,
    topContent,
    bottomContent,
    seoTitle,
    seoDescription
  }
`

/* ───────────────────────────────────────────── */
/* SETTINGS (singleton "site-settings")          */
/* ───────────────────────────────────────────── */

export const SETTINGS_QUERY = `
  *[_type == "settings" && _id == "site-settings"][0]{
    affiliateUrl
  }
`

/* ───────────────────────────────────────────── */
/* BLOG                                         */
/* ───────────────────────────────────────────── */

export const BLOGS_QUERY = `
  *[_type == "blog" && publie == true && defined(slug.current)]
  | order(datePublication desc){
    _id, titre, slug, extrait, imageUrl, image{ asset->{url} }, datePublication
  }
`

export const BLOG_BY_SLUG_QUERY = `
  *[_type == "blog" && slug.current == $slug && publie == true][0]{
    _id, titre, slug, extrait, contenu, imageUrl, image{ asset->{url} },
    datePublication, seoTitle, seoDescription
  }
`

/* ───────────────────────────────────────────── */
/* SAFE FETCH — never crashes a page             */
/* ───────────────────────────────────────────── */

export async function safeFetch<T>(
  query: string,
  params: Record<string, any> = {},
  fallback: T
): Promise<T> {
  try {
    const res = await client.fetch(query, params, { cache: 'no-store' })
    return (res ?? fallback) as T
  } catch (e) {
    console.error('❌ Sanity fetch error:', e)
    return fallback
  }
}

/** Fisher–Yates shuffle (unbiased, unlike sort(random)). */
export function shuffle<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
