import { DEFAULT_TEXTS, type TextKey } from './texts-defaults'

/** All texts of the site (strings) + the 3 legal pages (rich text). */
export type Texts = Record<TextKey, string> & {
  legalContent?: any[]
  conditionsContent?: any[]
  privacyContent?: any[]
}

/** Only the short texts — safe to send to the browser (menu, popup, swipe…). */
export type UiTexts = Record<TextKey, string>

/** Replaces {placeholders}. {siteName}, {location} and {year} are always available. */
export function fill(
  text: string | undefined,
  vars: Record<string, string | number | undefined | null> = {},
  base?: Partial<UiTexts>
): string {
  const all: Record<string, string | number | undefined | null> = {
    siteName: base?.siteName,
    location: base?.location,
    year: new Date().getFullYear(),
    ...vars,
  }
  return (text ?? '').replace(/\{(\w+)\}/g, (m, k) => (all[k] !== undefined && all[k] !== null ? String(all[k]) : m)).trim()
}

/** Short helper: const t = makeT(texts); t('countMany', { count: 3 }) */
export function makeT(texts: UiTexts) {
  return (key: TextKey, vars: Record<string, string | number | undefined | null> = {}) =>
    fill(texts[key] ?? DEFAULT_TEXTS[key], vars, texts)
}

/** Removes the long legal pages before sending texts to the browser. */
export function uiOnly(texts: Texts): UiTexts {
  const { legalContent, conditionsContent, privacyContent, ...ui } = texts
  return ui as UiTexts
}
