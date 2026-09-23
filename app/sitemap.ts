import type { MetadataRoute } from 'next'
import { safeFetch } from '@/lib/sanity'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

type Row = { slug: string; updated: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profiles, cats, posts] = await Promise.all([
    safeFetch<Row[]>(
      `*[_type == "profile"]{ "slug": coalesce(slug.current, _id), "updated": _updatedAt }`,
      {},
      []
    ),
    safeFetch<Row[]>(
      `*[_type == "categorie" && defined(slug.current)]{ "slug": slug.current, "updated": _updatedAt }`,
      {},
      []
    ),
    safeFetch<Row[]>(
      `*[_type == "blog" && publie == true && defined(slug.current)]{ "slug": slug.current, "updated": _updatedAt }`,
      {},
      []
    ),
  ])

  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/annonces`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/tags`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  return [
    ...staticPages,
    ...cats.map((c) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      lastModified: new Date(c.updated),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...profiles.map((p) => ({
      url: `${SITE_URL}/profil/${encodeURIComponent(p.slug)}`,
      lastModified: new Date(p.updated),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...posts.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: new Date(b.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
