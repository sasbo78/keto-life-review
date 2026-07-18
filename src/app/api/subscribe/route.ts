import { NextResponse } from 'next/server'

const SUBSCRIBERS_FILE = process.cwd() + '/subscribers.json'

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const fs = await import('fs/promises')
    let subscribers: Array<{ email: string; source: string; date: string }> = []

    try {
      const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8')
      subscribers = JSON.parse(data)
    } catch {}

    if (subscribers.some(s => s.email === email)) {
      return NextResponse.json({ message: 'Already subscribed' })
    }

    subscribers.push({
      email,
      source: source || 'unknown',
      date: new Date().toISOString(),
    })

    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
