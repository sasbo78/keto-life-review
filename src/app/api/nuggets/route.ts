import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const nuggets = await db.nugget.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(nuggets)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch nuggets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, product, niche, searchVolume, competition, commission, monthlyEarnings, intent, platform, source, notes } = body

    if (!keyword || !product || !niche) {
      return NextResponse.json({ error: 'Keyword, product, and niche are required' }, { status: 400 })
    }

    const nugget = await db.nugget.create({
      data: {
        keyword,
        product,
        niche,
        searchVolume: searchVolume ?? 0,
        competition: competition ?? 0,
        commission: commission ?? 0,
        monthlyEarnings: monthlyEarnings ?? 0,
        intent: intent ?? 'buy',
        platform: platform ?? 'pinterest',
        status: 'active',
        source: source ?? 'manual',
        notes: notes ?? null,
      },
    })

    return NextResponse.json(nugget, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create nugget' }, { status: 500 })
  }
}
