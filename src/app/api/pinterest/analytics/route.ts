import { NextResponse } from 'next/server'
import { getAnalytics } from '@/lib/pinterest'

export async function GET() {
  try {
    const data = await getAnalytics()
    return NextResponse.json(data)
  } catch (err: any) {
    if (err.message === 'PINTEREST_NOT_AUTHENTICATED') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
