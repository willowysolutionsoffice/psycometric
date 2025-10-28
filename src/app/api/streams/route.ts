import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { streamSchema } from '@/schemas/stream-schema'

// GET - Fetch all streams
export async function GET() {
  try {
    const streams = await prisma.stream.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(streams)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch streams' },
      { status: 500 }
    )
  }
}

// POST - Create a new stream
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = streamSchema.parse(body)

    const stream = await prisma.stream.create({
      data: validatedData,
    })

    return NextResponse.json(stream, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create stream' },
      { status: 500 }
    )
  }
}
