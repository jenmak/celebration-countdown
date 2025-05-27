import { NextResponse } from 'next/server'
import { initSocket } from '@/lib/socket'

export async function GET(req: Request, res: any) {
  try {
    const io = initSocket(res)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error initializing socket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 