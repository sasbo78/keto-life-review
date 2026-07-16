import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode } from '@/lib/blogger'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')
  if (error) {
    return NextResponse.redirect(new URL('/?blogger=error', request.url))
  }
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    await exchangeCode(code)
    return NextResponse.redirect(new URL('/?blogger=connected', request.url))
  } catch {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
}
