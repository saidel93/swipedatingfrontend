import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { fill, type UiTexts } from '@/lib/fill'

/** Replaces {siteName}, {location}… inside the rich text coming from Sanity. */
function fillBlocks(blocks: any[] = [], texts: UiTexts): any[] {
  return blocks.map((b) =>
    b?._type === 'block'
      ? {
          ...b,
          children: (b.children || []).map((c: any) =>
            typeof c?.text === 'string' ? { ...c, text: c.text.replace(/\{(\w+)\}/g, (m: string) => fill(m, {}, texts)) } : c
          ),
        }
      : b
  )
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2
        style={{
          fontSize: '1.35rem',
          color: 'white',
          margin: '40px 0 14px',
          paddingBottom: 10,
          borderBottom: '1px solid rgba(255,255,255,.07)',
        }}
      >
        {children}
      </h2>
    ),
    // "Encadré important" (pink box)
    h3: ({ children }) => (
      <p
        style={{
          background: 'rgba(225,29,72,.08)',
          border: '1px solid rgba(225,29,72,.25)',
          borderRadius: 14,
          padding: '14px 20px',
          color: '#fb7185',
          fontWeight: 700,
          fontSize: '.95rem',
          margin: '0 0 12px',
        }}
      >
        {children}
      </p>
    ),
    normal: ({ children }) => <p style={{ marginBottom: 12 }}>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ color: 'white' }}>{children}</strong>,
  },
}

export default function LegalPage({
  title,
  intro,
  content,
  texts,
}: {
  title: string
  intro: string
  content: any[] | undefined
  texts: UiTexts
}) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>
          <p className="page-breadcrumb">
            <Link href="/" style={{ color: '#7c8590', textDecoration: 'none' }}>
              {fill(texts.breadcrumbHome, {}, texts)}
            </Link>{' '}
            › <span style={{ color: '#fb7185' }}>{title}</span>
          </p>
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </div>
      </div>

      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '0 20px 80px',
          color: '#9ba3af',
          fontSize: '.9rem',
          lineHeight: 1.85,
          fontFamily: "'Figtree',sans-serif",
        }}
      >
        <PortableText value={fillBlocks(content, texts)} components={components} />
      </div>
    </div>
  )
}
