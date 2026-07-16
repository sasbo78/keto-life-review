import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode } from '@/lib/pinterest'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/?pinterest=error', request.url))

  try {
    await exchangeCode(code)
    return NextResponse.redirect(new URL('/?pinterest=connected', request.url))
  } catch (err: any) {
    return NextResponse.redirect(new URL(`/?pinterest=error&message=${encodeURIComponent(err.message)}`, request.url))
  }
}
