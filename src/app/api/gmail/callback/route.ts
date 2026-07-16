import { NextRequest, NextResponse } from 'next/server'
import { exchangeGmailCode } from '@/lib/emailPublisher'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.redirect(new URL('/?gmail=error', request.url))
  }
  try {
    await exchangeGmailCode(code)
    return NextResponse.redirect(new URL('/?gmail=connected', request.url))
  } catch (err: any) {
    return NextResponse.redirect(new URL(`/?gmail=error&message=${encodeURIComponent(err.message)}`, request.url))
  }
}
