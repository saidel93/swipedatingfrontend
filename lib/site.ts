/* ───────────────────────────────────────────── */
/* SITE CONFIG — change the brand in ONE place   */
/* ───────────────────────────────────────────── */

export const SITE_NAME = 'Swipe Québec'

export const SITE_TAGLINE = 'Glissez, craquez, discutez'

export const SITE_DESCRIPTION =
  'Swipez les profils de femmes célibataires du Québec : à droite pour voir son profil, vers le haut pour discuter avec elle. Tous les profils sont aussi dans la page Annonces.'

/** Location shown on every profile (the site covers all of Québec). */
export const SITE_LOCATION = 'Québec'

/**
 * Public URL of the site, WITHOUT trailing slash.
 * Set NEXT_PUBLIC_SITE_URL in Netlify (e.g. https://swipequebec.com).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/+$/, '')

/** Domain name saved with each lead (e.g. rencontrequebec.com). */
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, '')
