import { NextRequest, NextResponse } from 'next/server'
import { createPin, getPins } from '@/lib/pinterest'

export async function GET() {
  try {
    const data = await getPins()
    return NextResponse.json(data)
  } catch (err: any) {
    if (err.message === 'PINTEREST_NOT_AUTHENTICATED') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { board_id, title, description, link, image_url } = await request.json()

    if (!board_id || !title || !image_url) {
      return NextResponse.json({ error: 'board_id, title, and image_url required' }, { status: 400 })
    }

    const pin = await createPin({
      board_id,
      title,
      description: description || title,
      link: link || process.env.AFFILIATE_LINK || 'https://amzn.to/4hcHEKn',
      media_source: {
        source_type: 'image_url',
        url: image_url,
      },
      alt_text: title,
    })

    return NextResponse.json(pin)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
