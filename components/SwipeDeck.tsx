'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { makeT, type UiTexts } from '@/lib/fill'

export type SwipeCard = {
  id: string
  href: string
  name: string
  age?: number
  tagline?: string
  photo: string
  category?: string
  emoji?: string
  online?: boolean
  verified?: boolean
  affiliateUrl: string
}

type Dir = 'left' | 'right' | 'up'

const THRESHOLD = 100 // px to trigger a swipe
const FLY_MS = 280 // exit animation duration

/**
 * Tinder-style deck:
 *  ← left  = pass (next profile)
 *  → right = open the profile page
 *  ↑ up    = go to the partner (affiliate) link to chat
 * Works with touch, mouse, the 3 buttons and the keyboard arrows.
 */
export default function SwipeDeck({
  cards,
  totalProfiles,
  texts,
}: {
  cards: SwipeCard[]
  totalProfiles: number
  texts: UiTexts
}) {
  const t = makeT(texts)
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [leaving, setLeaving] = useState<Dir | null>(null)
  const [showHelp, setShowHelp] = useState(true)
  const start = useRef<{ x: number; y: number } | null>(null)
  const busy = useRef(false)

  const card = cards[index]
  const next = cards[index + 1]

  // Preload the photo after the next one, so cards appear instantly
  useEffect(() => {
    const after = cards[index + 2]
    if (after) {
      const img = new Image()
      img.src = after.photo
    }
  }, [index, cards])

  const swipe = useCallback(
    (dir: Dir) => {
      if (!card || busy.current) return
      busy.current = true
      setShowHelp(false)
      setLeaving(dir)

      window.setTimeout(() => {
        if (dir === 'right') {
          router.push(card.href)
        } else if (dir === 'up') {
          if (card.affiliateUrl && card.affiliateUrl !== '#') window.location.href = card.affiliateUrl
          else router.push(card.href) // no partner link configured → profile page
        }
        setIndex((i) => i + 1)
        setDrag({ x: 0, y: 0 })
        setLeaving(null)
        busy.current = false
      }, FLY_MS)
    },
    [card, router]
  )

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowLeft') swipe('left')
      else if (e.key === 'ArrowRight') swipe('right')
      else if (e.key === 'ArrowUp') {
        e.preventDefault()
        swipe('up')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [swipe])

  /* ───── Pointer (touch + mouse) ───── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (busy.current) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, y: e.clientY }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !start.current) return
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y })
  }
  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    start.current = null
    const { x, y } = drag
    if (y < -THRESHOLD && Math.abs(y) > Math.abs(x)) swipe('up')
    else if (x > THRESHOLD) swipe('right')
    else if (x < -THRESHOLD) swipe('left')
    else setDrag({ x: 0, y: 0 }) // not far enough → snap back
  }

  /* ───── Card position ───── */
  let transform = `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 18}deg)`
  if (leaving === 'left') transform = `translate(-150%, ${drag.y}px) rotate(-28deg)`
  if (leaving === 'right') transform = `translate(150%, ${drag.y}px) rotate(28deg)`
  if (leaving === 'up') transform = `translate(${drag.x}px, -160%) rotate(0deg)`

  const likeOpacity = leaving === 'right' ? 1 : Math.min(Math.max(drag.x / THRESHOLD, 0), 1)
  const nopeOpacity = leaving === 'left' ? 1 : Math.min(Math.max(-drag.x / THRESHOLD, 0), 1)
  const upOpacity =
    leaving === 'up' ? 1 : Math.abs(drag.y) > Math.abs(drag.x) ? Math.min(Math.max(-drag.y / THRESHOLD, 0), 1) : 0

  /* ───── End of the deck ───── */
  if (!card) {
    return (
      <div className="sw-wrap">
        <div className="sw-end">
          <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>💫</div>
          <h3>{t('swipeEndTitle')}</h3>
          <p>{t('swipeEndText', { count: totalProfiles })}</p>
          <div className="sw-end-actions">
            <Link href="/annonces" className="sw-btn-primary">
              {t('swipeEndButton')}
            </Link>
            <button type="button" className="sw-btn-ghost" onClick={() => setIndex(0)}>
              {t('swipeRestart')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sw-wrap">
      <div className="sw-stage">
        {/* Next card (behind) */}
        {next && (
          <div className="sw-card sw-card-back" aria-hidden="true">
            <img src={next.photo} alt="" draggable={false} />
            <div className="sw-shade" />
          </div>
        )}

        {/* Top card */}
        <div
          key={card.id}
          className="sw-card"
          style={{
            transform,
            transition: dragging ? 'none' : `transform ${FLY_MS}ms ease`,
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="group"
          aria-label={`${card.name}, ${t('ageText', { age: card.age })}`}
        >
          <img src={card.photo} alt={`${card.name}, ${t('ageText', { age: card.age })}`} draggable={false} />
          <div className="sw-shade" />

          {/* Stamps */}
          <span className="sw-stamp sw-stamp-like" style={{ opacity: likeOpacity }}>
            {t('swipeStampLike')}
          </span>
          <span className="sw-stamp sw-stamp-nope" style={{ opacity: nopeOpacity }}>
            {t('swipeStampNope')}
          </span>
          <span className="sw-stamp sw-stamp-up" style={{ opacity: upOpacity }}>
            {t('swipeStampUp')}
          </span>

          {/* Badges */}
          <div className="sw-badges">
            {card.online && <span className="sw-online">{t('swipeOnline')}</span>}
            {card.verified && <span className="sw-verified">{t('swipeVerified')}</span>}
          </div>

          {/* Info */}
          <div className="sw-info">
            <div className="sw-name">
              {card.name}
              {card.age ? <span>{card.age}</span> : null}
            </div>
            {card.tagline && <p className="sw-tagline">{card.tagline}</p>}
            {card.category && (
              <span className="sw-cat">
                {card.emoji} {card.category}
              </span>
            )}
          </div>

          {/* First-time help */}
          {showHelp && index === 0 && (
            <div className="sw-help" aria-hidden="true">
              <span>{t('swipeHelpLeft')}</span>
              <span>{t('swipeHelpUp')}</span>
              <span>{t('swipeHelpRight')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="sw-actions">
        <div className="sw-act-col">
          <button type="button" className="sw-action sw-nope" onClick={() => swipe('left')} aria-label={t('swipeBtnNope')}>
            ✕
          </button>
          <span>{t('swipeBtnNope')}</span>
        </div>
        <div className="sw-act-col">
          <button type="button" className="sw-action sw-up" onClick={() => swipe('up')} aria-label={t('swipeBtnUp')}>
            💬
          </button>
          <span>{t('swipeBtnUp')}</span>
        </div>
        <div className="sw-act-col">
          <button type="button" className="sw-action sw-like" onClick={() => swipe('right')} aria-label={t('swipeBtnLike')}>
            ❤
          </button>
          <span>{t('swipeBtnLike')}</span>
        </div>
      </div>

      <p className="sw-counter">
        {index + 1} / {cards.length}
      </p>
    </div>
  )
}
