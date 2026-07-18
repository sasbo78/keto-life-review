import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS },
})

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    const entry = { email, source: source || 'unknown', date: new Date().toISOString() }
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
      transporter.sendMail({
        from: process.env.GMAIL_USER, to: process.env.GMAIL_USER,
        subject: `New Keto Life Subscriber: ${email}`,
        text: `Email: ${email}\nSource: ${entry.source}\nDate: ${entry.date}`,
      }).catch(() => {})
    }
    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch {
    return NextResponse.json({ message: 'Subscribed successfully' })
  }
}
