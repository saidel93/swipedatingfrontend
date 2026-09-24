import Link from 'next/link'
import { makeT, type UiTexts } from '@/lib/fill'

export default function Footer({ texts }: { texts: UiTexts }) {
  const t = makeT(texts)
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '52px 0 28px', marginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 36 }}>
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700, background: 'linear-gradient(135deg,#fb7185,#e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>{t('siteName')}</div>
            <p style={{ color: '#6b7280', fontSize: '.82rem', lineHeight: 1.7 }}>{t('footerDescription')}</p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '.68rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, fontFamily: "'Figtree',sans-serif" }}>{t('footerExploreTitle')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { href: '/annonces',   label: t('footerLinkAnnonces') },
                { href: '/categories', label: t('footerLinkCategories') },
                { href: '/blog',       label: t('footerLinkBlog') },
                { href: '/tags',       label: t('footerLinkTags') },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '.83rem' }}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '.68rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, fontFamily: "'Figtree',sans-serif" }}>{t('footerLegalTitle')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { href: '/legal',           label: t('footerLinkLegal') },
                { href: '/confidentialite', label: t('footerLinkPrivacy') },
                { href: '/conditions',      label: t('footerLinkConditions') },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '.83rem' }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.04)', paddingTop: 18, marginBottom: 20 }}>
          <p style={{ color: '#374151', fontSize: '.7rem', lineHeight: 1.8 }}>
            {t('footerDisclaimer')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.05)' }}>
          <span style={{ color: '#374151', fontSize: '.74rem' }}>
            {t('footerCopyright')}
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { href: '/legal',           label: t('footerBottomLegal') },
              { href: '/confidentialite', label: t('footerBottomPrivacy') },
              { href: '/conditions',      label: t('footerBottomConditions') },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ color: '#374151', textDecoration: 'none', fontSize: '.74rem' }}>{l.label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
