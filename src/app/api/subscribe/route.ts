import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    const entry = { email, source: source || 'unknown', date: new Date().toISOString() }
    console.log('[SUBSCRIBE]', JSON.stringify(entry))
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry),
      }).catch(() => {})
    }
    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch {
    return NextResponse.json({ message: 'Subscribed successfully' })
  }
}
