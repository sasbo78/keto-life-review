import { NextRequest, NextResponse } from 'next/server'
import * as path from 'path'
import { publishArticlesToBlogger } from '@/lib/emailPublisher'

export async function POST(request: NextRequest) {
  try {
    const { articlesDir } = await request.json()
    const dir = articlesDir || path.join(process.cwd(), 'src', 'data', 'articles')
    const result = await publishArticlesToBlogger(dir)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Email publishing failed' }, { status: 500 })
  }
}
