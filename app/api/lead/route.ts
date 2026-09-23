import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Write client — uses the SECRET token (server only, never NEXT_PUBLIC_)
function getWriteClient() {
  const token = process.env.SANITY_API_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!token || !projectId) return null

  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })
}

const clip = (v: unknown, max = 200) =>
  typeof v === 'string' ? v.trim().slice(0, max) : undefined

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = clip(body?.email, 254)?.toLowerCase()

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const client = getWriteClient()
    if (!client) {
      console.error('❌ SANITY_API_TOKEN or NEXT_PUBLIC_SANITY_PROJECT_ID missing — lead not saved')
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    // One lead per email + website (no duplicates)
    const website = clip(body?.website, 100)
    const existing = await client.fetch(
      `*[_type == "lead" && email == $email && website == $website][0]._id`,
      { email, website: website ?? null }
    )

    if (!existing) {
      await client.create({
        _type: 'lead',
        email,
        profileName: clip(body?.profileName),
        category: clip(body?.category),
        city: clip(body?.city),
        country: clip(body?.country),
        website,
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Lead API Error:', error)
    return NextResponse.json({ error: 'Server error while saving lead' }, { status: 500 })
  }
}
