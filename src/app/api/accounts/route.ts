import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const accounts = await db.account.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(accounts)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { platform, label, username, proxy } = await request.json()
    if (!platform || !label) return NextResponse.json({ error: 'platform and label required' }, { status: 400 })
    const account = await db.account.create({ data: { platform, label, username: username ?? null, proxy: proxy ?? null } })
    return NextResponse.json(account, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    await db.account.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
