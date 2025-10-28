import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const resetPasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = resetPasswordSchema.parse(body);

    // Use Better Auth's changePassword method
    try {
      await auth.api.changePassword({
        body: {
          currentPassword: validatedData.currentPassword,
          newPassword: validatedData.newPassword,
        },
        headers: request.headers,
      });

      return NextResponse.json(
        { message: 'Password updated successfully' },
        { status: 200 }
      );
    } catch (changePasswordError: unknown) {
      const errorMessage = changePasswordError instanceof Error 
        ? changePasswordError.message 
        : 'Failed to update password';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
