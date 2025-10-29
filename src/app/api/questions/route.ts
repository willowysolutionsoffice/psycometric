import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

import { questionSchema } from '@/schemas/question-schema'

// GET - Fetch all questions
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        category: true,
        stream: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

// POST - Create a new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = questionSchema.parse(body)

    const question = await prisma.question.create({
      data: validatedData,
      include: {
        category: true,
        stream: true,
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: (error as z.ZodError).errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}
