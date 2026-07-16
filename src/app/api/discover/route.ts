import { NextRequest, NextResponse } from 'next/server'

const INTENTS = ['buy', 'compare', 'info', 'review']
const PLATFORMS = ['pinterest', 'tiktok', 'google', 'youtube']
const PATTERNS = [
  (p: string) => `best ${p} for weight loss`,
  (p: string) => `${p} before and after`,
  (p: string) => `top rated ${p} 2026`,
  (p: string) => `${p} reviews honest`,
  (p: string) => `where to buy ${p}`,
  (p: string) => `${p} that actually works`,
  (p: string) => `${p} price`,
  (p: string) => `does ${p} work`,
  (p: string) => `${p} benefits`,
  (p: string) => `${p} vs competitors`,
  (p: string) => `${p} for beginners`,
  (p: string) => `${p} results 30 days`,
  (p: string) => `${p} coupon code`,
  (p: string) => `${p} amazon`,
  (p: string) => `${p} side effects`,
  (p: string) => `cheap ${p}`,
  (p: string) => `best place to buy ${p}`,
  (p: string) => `${p} for women`,
  (p: string) => `${p} tutorial`,
  (p: string) => `${p} discount`,
]

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function generateNuggets(product: string, niche: string) {
  const seen = new Set<string>()
  const nuggets = []

  for (let i = 0; i < PATTERNS.length; i++) {
    const keyword = PATTERNS[i](product)
    if (seen.has(keyword)) continue
    seen.add(keyword)

    const seed = i * 7 + product.length * 13 + niche.length * 3
    const r = seededRandom(seed)
    const r2 = seededRandom(seed + 1)
    const r3 = seededRandom(seed + 2)

    const searchVolume = Math.floor(100 + r * 19900)
    const competition = Math.floor(5 + r2 * 90)
    const commission = 5 + Math.floor(r3 * 45)
    const monthlyEarnings = Math.floor(searchVolume * (commission / 100) * (0.5 + r2 * 2))

    nuggets.push({
      keyword,
      product,
      niche,
      searchVolume,
      competition,
      commission,
      monthlyEarnings,
      intent: INTENTS[Math.floor(r * INTENTS.length)],
      platform: PLATFORMS[Math.floor(r2 * PLATFORMS.length)],
      source: 'auto',
    })
  }

  nuggets.sort((a, b) => b.monthlyEarnings - a.monthlyEarnings)
  return nuggets.slice(0, 15)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product, niche } = body

    if (!product || !niche) {
      return NextResponse.json({ error: 'Product and niche are required' }, { status: 400 })
    }

    const nuggets = generateNuggets(product.toLowerCase().trim(), niche.toLowerCase().trim())

    return NextResponse.json({ nuggets, count: nuggets.length })
  } catch {
    return NextResponse.json({ error: 'Discovery failed' }, { status: 500 })
  }
}
