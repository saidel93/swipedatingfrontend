import { cache } from 'react'
import { safeFetch } from './sanity'
import { DEFAULT_TEXTS } from './texts-defaults'
import LEGAL_DEFAULTS from './legal-defaults.json'
import type { Texts } from './fill'

export { fill, makeT, uiOnly } from './fill'
export type { Texts, UiTexts } from './fill'

const TEXTS_QUERY = `*[_type == "siteTexts" && _id == "site-texts"][0]`

const isEmpty = (v: unknown) =>
  v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0)

/**
 * All texts of the website, from Sanity → "🌐 Textes du site".
 * Any empty field falls back to the default text, so the site never shows a blank.
 * Cached once per page view.
 */
export const getTexts = cache(async (): Promise<Texts> => {
  const doc = await safeFetch<Record<string, any> | null>(TEXTS_QUERY, {}, null)
  const texts: Record<string, any> = { ...DEFAULT_TEXTS, ...(LEGAL_DEFAULTS as Record<string, any[]>) }
  if (doc) {
    for (const [k, v] of Object.entries(doc)) {
      if (!k.startsWith('_') && !isEmpty(v)) texts[k] = v
    }
  }
  return texts as Texts
})
