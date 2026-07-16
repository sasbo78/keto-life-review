import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const earnings = await db.earning.findMany({ orderBy: { date: 'desc' } })
    const total = earnings.reduce((s, e) => s + e.amount, 0)
    return NextResponse.json({ earnings, total })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { source, amount, note } = await request.json()
    if (!source || !amount) return NextResponse.json({ error: 'source and amount required' }, { status: 400 })
    const earning = await db.earning.create({ data: { source, amount: parseFloat(amount), note: note ?? '' } })
    return NextResponse.json(earning, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
