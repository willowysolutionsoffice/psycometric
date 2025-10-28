import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { streamSchema } from '@/schemas/stream-schema'

// GET - Fetch a single stream by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const stream = await prisma.stream.findUnique({
      where: { id },
    })

    if (!stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(stream)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stream' },
      { status: 500 }
    )
  }
}

// PUT - Update a stream
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = streamSchema.parse(body)

    const stream = await prisma.stream.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(stream)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update stream' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a stream
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.stream.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Stream deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete stream' },
      { status: 500 }
    )
  }
}
