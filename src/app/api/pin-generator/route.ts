import { NextRequest, NextResponse } from 'next/server'
import { generateMultiplePins } from '@/lib/pinGenerator'

export async function POST(request: NextRequest) {
  try {
    const { articlesDir, outputDir } = await request.json()
    const dir = articlesDir || 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee'
    const out = outputDir || 'C:\\Users\\mohel\\Desktop\\Best Keto Coffee\\generated-pins'

    const results = await generateMultiplePins(dir, out)
    return NextResponse.json({ success: true, pins: results })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
