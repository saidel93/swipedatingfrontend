/* ───────────────────────────────────────────── */
/* CATEGORIE                                    */
/* ───────────────────────────────────────────── */

export interface Categorie {
  _id: string
  nom: string
  slug: {
    current: string
  }

  emoji?: string
  description?: string
  profileCount?: number

  /* SEO content blocks (text above / below the profiles) */
  topContent?: string
  bottomContent?: string

  /* SEO */
  seoTitle?: string
  seoDescription?: string
}

/* ───────────────────────────────────────────── */
/* PROFILE                                      */
/* ───────────────────────────────────────────── */

export interface Profile {
  _id: string

  slug?: {
    current?: string
  }

  nom: string
  age: number

  categorie?: Categorie

  tagline?: string
  bio?: string
  heroTitle?: string

  /* SEO */
  seoTitle?: string
  seoDescription?: string

  /* Images uploaded in Sanity */
  photo?: any
  photos?: any[]

  /* Images by URL (used when nothing is uploaded) */
  photoUrl?: string
  photosUrls?: { url: string; alt?: string }[]

  verifie?: {
    photo?: boolean
    email?: boolean
    telephone?: boolean
    premium?: boolean
  }

  online?: boolean
  vedette?: boolean
  membreDepuis?: string
  derniereActivite?: string
  tags?: string[]
  affiliateUrl?: string
}

/* ───────────────────────────────────────────── */
/* SITE SETTINGS                                */
/* ───────────────────────────────────────────── */

export interface SiteSettings {
  affiliateUrl?: string
  siteName?: string
  siteDescription?: string

  /* Homepage */
  homeSeoTitle?: string
  homeSeoDescription?: string
  homeSubtitle?: string

  /* Categories page */
  categoriesSeoTitle?: string
  categoriesSeoDescription?: string

  /* Annonces page */
  annoncesSeoTitle?: string
  annoncesSeoDescription?: string
}
