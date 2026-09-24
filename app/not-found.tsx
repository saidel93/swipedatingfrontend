import Link from 'next/link'
import { getTexts, makeT, uiOnly } from '@/lib/texts'

export default async function NotFound() {
  const t = makeT(uiOnly(await getTexts()))
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 600,
        margin: '0 auto',
        padding: '100px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>💔</div>
      <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: 10 }}>{t('notFoundTitle')}</h1>
      <p style={{ color: '#7c8590', marginBottom: 28 }}>{t('notFoundText')}</p>
      <Link
        href="/annonces"
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg,#e11d48,#9f1239)',
          color: '#fff',
          fontWeight: 700,
          padding: '12px 26px',
          borderRadius: 14,
          textDecoration: 'none',
        }}
      >
        {t('notFoundButton')}
      </Link>
    </div>
  )
}
