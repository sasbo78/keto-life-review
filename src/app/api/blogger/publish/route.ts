import { NextRequest, NextResponse } from 'next/server'
import { publishPost } from '@/lib/blogger'

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
    }

    const result = await publishPost(title, content)
    return NextResponse.json({ success: true, url: result.url })
  } catch (err: any) {
    if (err.message === 'NOT_AUTHENTICATED') {
      return NextResponse.json({ error: 'Not authenticated. Connect to Blogger first.', authUrl: '/api/blogger/auth' }, { status: 401 })
    }
    return NextResponse.json({ error: err.message || 'Publish failed' }, { status: 500 })
  }
}
