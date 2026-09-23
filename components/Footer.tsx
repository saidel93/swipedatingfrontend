import Link from 'next/link'
import { SITE_NAME } from '@/lib/site'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '52px 0 28px', marginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 36 }}>
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700, background: 'linear-gradient(135deg,#fb7185,#e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>{SITE_NAME}</div>
            <p style={{ color: '#6b7280', fontSize: '.82rem', lineHeight: 1.7 }}>Annuaire de rencontres partenaires partout au Québec. Site d&apos;affiliation pour adultes 18+.</p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '.68rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, fontFamily: "'Figtree',sans-serif" }}>Explorer</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { href: '/annonces',   label: '❤ Annonces' },
                { href: '/categories', label: '💝 Catégories' },
                { href: '/blog',       label: '📝 Blog' },
                { href: '/tags',       label: '🏷️ Tags' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '.83rem' }}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '.68rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, fontFamily: "'Figtree',sans-serif" }}>Informations légales</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { href: '/legal',           label: '⚖️ Informations légales' },
                { href: '/confidentialite', label: '🔒 Confidentialité' },
                { href: '/conditions',      label: "📄 Conditions d'utilisation" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '.83rem' }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.04)', paddingTop: 18, marginBottom: 20 }}>
          <p style={{ color: '#374151', fontSize: '.7rem', lineHeight: 1.8 }}>
            ⚠️ <strong style={{ color: '#4b5563' }}>Affiliation :</strong> Ce site perçoit une commission sur les inscriptions via les liens partenaires, sans coût supplémentaire pour vous.
            {' '}ℹ️ <strong style={{ color: '#4b5563' }}>Annuaire vitrine :</strong> Aucun contact direct — les profils redirigent vers des plateformes partenaires.
            {' '}🔞 Réservé aux adultes de 18 ans et plus.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.05)' }}>
          <span style={{ color: '#374151', fontSize: '.74rem' }}>
            © {new Date().getFullYear()} {SITE_NAME} — Site d&apos;affiliation. Pour adultes 18+.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { href: '/legal',           label: 'Légal' },
              { href: '/confidentialite', label: 'Confidentialité' },
              { href: '/conditions',      label: 'Conditions' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ color: '#374151', textDecoration: 'none', fontSize: '.74rem' }}>{l.label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
