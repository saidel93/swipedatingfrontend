'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { makeT, type UiTexts } from '@/lib/fill'

export default function Navbar({ texts }: { texts: UiTexts }) {
  const t = makeT(texts)
  const LINKS = [
    { href: '/', label: t('navHome'), icon: '🏠' },
    { href: '/annonces', label: t('navAnnonces'), icon: '❤' },
    { href: '/categories', label: t('navCategories'), icon: '💖' },
    { href: '/blog', label: t('navBlog'), icon: '📝' },
  ]
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [q, setQ] = useState('')
  const [onlineCount, setOnlineCount] = useState<number | null>(null)

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 71) + 50)
  }, [])

  const close = () => setMobileOpen(false)

  const search = () => {
    const value = q.trim()
    if (!value) return
    router.push(`/annonces?q=${encodeURIComponent(value)}`)
    setQ('')
    close()
  }

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 200, width: '100%' }}>
      {/* ───────── TOP BAR ───────── */}
      <div
        style={{
          background: 'rgba(8,10,16,.99)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,.09)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 16px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={close}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#fb7185,#9f1239)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                boxShadow: '0 4px 18px rgba(225,29,72,.45)',
              }}
            >
              ❤️
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '1.2rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg,#fb7185,#e11d48,#c9913a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {t('siteName')}
            </span>
          </Link>

          {/* Search (desktop) */}
          <div className="nav-search" style={{ flex: 1, maxWidth: 340, position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 13,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
              }}
            >
              🔍
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder={t('searchPlaceholder')}
              aria-label="Rechercher"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.11)',
                borderRadius: 50,
                padding: '9px 16px 9px 38px',
                color: 'white',
                fontSize: '.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="nav-online"
              style={{
                alignItems: 'center',
                background: 'rgba(34,197,94,.09)',
                border: '1px solid rgba(34,197,94,.28)',
                borderRadius: 50,
                padding: '6px 13px',
                fontSize: '.77rem',
                color: '#86efac',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  background: '#22c55e',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: 6,
                }}
              />
              <span suppressHydrationWarning>
                {onlineCount !== null ? t('onlineText', { count: onlineCount }) : '...'}
              </span>
            </div>

            <Link
              href="/annonces"
              onClick={close}
              style={{
                background: 'linear-gradient(135deg,#e11d48,#9f1239)',
                boxShadow: '0 4px 18px rgba(225,29,72,.38)',
                color: '#fff',
                fontWeight: 700,
                padding: '9px 20px',
                borderRadius: 50,
                fontSize: '.85rem',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t('joinButton')}
            </Link>

            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
              style={{
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: 8,
                padding: '8px 11px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* ───────── DESKTOP NAV ───────── */}
      <div
        className="nav-bottom"
        style={{ background: 'rgba(8,10,16,.95)', borderBottom: '1px solid rgba(255,255,255,.05)' }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 16px',
            height: 44,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" style={navLink}>
              {l.icon} {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ───────── MOBILE MENU ───────── */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#080a10',
            zIndex: 199,
            overflowY: 'auto',
          }}
        >
          <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder={t('searchPlaceholderMobile')}
              aria-label="Rechercher"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.11)',
                borderRadius: 50,
                padding: '11px 16px',
                color: 'white',
                fontSize: '.95rem',
                outline: 'none',
              }}
            />
          </div>
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              style={{
                display: 'block',
                padding: '16px 24px',
                color: '#d1d5db',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,.05)',
              }}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

const navLink: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  height: 44,
  borderRight: '1px solid rgba(255,255,255,.05)',
  color: '#9ba3af',
  fontSize: '.82rem',
  fontWeight: 500,
  textDecoration: 'none',
}
