import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

import { questionSchema } from '@/schemas/question-schema'

// GET - Fetch all questions
export async function GET() {
  try {
    console.log('Fetching questions...')
    // First try without includes to see if that's the issue
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    })
    console.log('Fetched questions without includes:', questions.length, 'questions')
    
    // If we have questions, try to get them with includes
    if (questions.length > 0) {
      const questionsWithIncludes = await prisma.question.findMany({
        include: {
          category: true,
          stream: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      console.log('Fetched questions with includes:', questionsWithIncludes.length, 'questions')
      return NextResponse.json(questionsWithIncludes)
    }
    
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
    console.log('Received question data:', body)
    
    const validatedData = questionSchema.parse(body)
    console.log('Validated data:', validatedData)

    const question = await prisma.question.create({
      data: validatedData,
      include: {
        category: true,
        stream: true,
      },
    })

    console.log('Created question:', question)
    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
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
