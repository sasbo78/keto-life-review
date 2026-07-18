import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (!WEBHOOK_URL) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
    }

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: source || 'unknown', date: new Date().toISOString() }),
    })

    if (!res.ok) throw new Error('Webhook failed')

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
