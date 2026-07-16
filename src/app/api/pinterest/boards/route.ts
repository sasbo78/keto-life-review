import { NextRequest, NextResponse } from 'next/server'
import { getBoards, createBoard } from '@/lib/pinterest'

export async function GET() {
  try {
    const data = await getBoards()
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
    const { name, description } = await request.json()
    const data = await createBoard(name, description)
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
