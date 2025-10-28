import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const questionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answerKey: z.string().min(1, 'Answer key is required'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).length(3, 'Exactly 3 options required'),
  stream: z.enum(['COMMERCE', 'SCIENCE', 'HUMANITIES']),
  categoryId: z.string().min(1, 'Category is required'),
})

// GET - Fetch a single question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    )
  }
}

// PUT - Update a question
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = questionSchema.parse(body)

    const question = await prisma.question.update({
      where: { id },
      data: validatedData,
      include: {
        category: true,
      },
    })

    return NextResponse.json(question)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: (error as z.ZodError).errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.question.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Question deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}
