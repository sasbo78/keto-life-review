import { NextResponse } from 'next/server'
import { getGmailAuthUrl } from '@/lib/emailPublisher'

export async function GET() {
  const url = getGmailAuthUrl()
  return NextResponse.redirect(url)
}
