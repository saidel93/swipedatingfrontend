/* ───────────────────────────────────────────── */
/* SITE CONFIG                                   */
/* All visible texts (name, location, language…) */
/* are in Sanity → "🌐 Textes du site".           */
/* ───────────────────────────────────────────── */

/**
 * Public URL of the site, WITHOUT trailing slash.
 * Set NEXT_PUBLIC_SITE_URL in Netlify (e.g. https://swipequebec.com).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

/** Domain name saved with each lead. */
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, '')
