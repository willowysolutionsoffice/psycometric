import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        stream: true,
        role: true,
        banned: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password and sensitive fields
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
