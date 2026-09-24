'use client'

import { useEffect, useState } from 'react'
import { SITE_DOMAIN } from '@/lib/site'
import { makeT, type UiTexts } from '@/lib/fill'

type Props = {
  affiliateUrl: string
  profileName: string
  category?: string
  texts: UiTexts
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function EmailGate({ affiliateUrl, profileName, category, texts }: Props) {
  const t = makeT(texts)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  // Close popup with Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !loading && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, loading])

  const goToPartner = () => {
    if (affiliateUrl && affiliateUrl !== '#') {
      window.location.href = affiliateUrl
    } else {
      setLoading(false)
      setError(t('popupErrorLink'))
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const value = email.trim().toLowerCase()

    if (!EMAIL_RE.test(value)) {
      setError(t('popupErrorEmail'))
      return
    }

    setError('')
    setLoading(true)

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: value,
          profileName,
          category,
          city: t('location'),
          country: t('country'),
          website: SITE_DOMAIN,
        }),
      })
    } catch (err) {
      // Never block the visitor if saving the lead fails
      console.error('Lead error:', err)
    }

    setTimeout(goToPartner, 1200)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ctaBtn"
        style={{
          display: 'block',
          width: '100%',
          padding: '18px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg,#e11d48,#9f1239)',
          boxShadow: '0 10px 30px rgba(225,29,72,.4)',
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 700,
          textAlign: 'center',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {t('popupButton')}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !loading && setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: 16,
            animation: 'fadeIn .3s ease',
          }}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg,#0f172a,#1e293b)',
              padding: '40px 28px 32px',
              borderRadius: '22px',
              width: '100%',
              maxWidth: '450px',
              textAlign: 'center',
              border: '1px solid rgba(225,29,72,.3)',
              boxShadow: '0 30px 80px rgba(0,0,0,.6)',
              animation: 'slideUp .3s ease',
            }}
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => !loading && setOpen(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 14,
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.3rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <h2 style={{ color: '#fff', fontSize: '1.7rem', marginBottom: '10px' }}>
              {t('popupTitle')}
            </h2>

            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '25px' }}>
              {t('popupText', { name: profileName })}
              <br />
              {t('popupText2')}
            </p>

            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              required
              placeholder={t('popupPlaceholder')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: `1px solid ${error ? '#f87171' : '#334155'}`,
                marginBottom: error ? '8px' : '18px',
                fontSize: '1rem',
                outline: 'none',
                color: '#0f172a',
              }}
            />

            {error && (
              <p style={{ color: '#f87171', fontSize: '.82rem', marginBottom: 14 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg,#e11d48,#be123c)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? t('popupLoading') : t('popupSubmit')}
            </button>

            <p style={{ marginTop: '15px', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.7 }}>
              {t('popupCheck1')}
              <br />
              {t('popupCheck2')}
              <br />
              {t('popupCheck3')}
            </p>

            <p style={{ marginTop: '12px', fontSize: '0.68rem', color: '#64748b' }}>
              {t('popupConsent')}{' '}
              <a href="/confidentialite" target="_blank" style={{ color: '#94a3b8' }}>
                {t('popupConsentLink')}
              </a>
              .
            </p>
          </form>
        </div>
      )}
    </>
  )
}
