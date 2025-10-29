import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch dashboard statistics
export async function GET() {
  try {
    // Get counts in parallel for better performance
    const [
      totalQuestions,
      totalStudents,
      totalCategories,
      totalStreams,
    ] = await Promise.all([
      prisma.question.count(),
      prisma.user.count({
        where: {
          OR: [
            { role: null }, // Include null roles (default students)
            { role: { not: 'admin' } }, // Include all non-admin roles
          ],
        },
      }),
      prisma.category.count(),
      prisma.stream.count(),
    ])

    return NextResponse.json({
      totalQuestions,
      totalStudents,
      totalCategories,
      totalStreams,
    })
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}

