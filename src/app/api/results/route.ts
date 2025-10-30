import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/results?userId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const result = await prisma.result.findUnique({ where: { userId } })
    if (!result) {
      return NextResponse.json({ exists: false }, { status: 200 })
    }
    return NextResponse.json({ exists: true, result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 })
  }
}

// POST /api/results { userId, score, details? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, score, details } = body as {
      userId?: string
      score?: number
      details?: unknown
    }

    if (!userId || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'userId and numeric score are required' },
        { status: 400 }
      )
    }

    const existing = await prisma.result.findUnique({ where: { userId } })
    if (existing) {
      return NextResponse.json(
        { error: 'Result already exists for this user' },
        { status: 409 }
      )
    }

    const created = await prisma.result.create({
      data: { userId, score, details: details ?? undefined },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 })
  }
}


