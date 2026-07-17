import { NextRequest, NextResponse } from 'next/server'
import * as path from 'path'
import { generateMultiplePins } from '@/lib/pinGenerator'

export async function POST(request: NextRequest) {
  try {
    const { articlesDir, outputDir } = await request.json()
    const dir = articlesDir || path.join(process.cwd(), 'src', 'data', 'articles')
    const out = outputDir || path.join(process.cwd(), 'public', 'generated-pins')

    const results = await generateMultiplePins(dir, out)
    return NextResponse.json({ success: true, pins: results })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
