import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/schemas/user-schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is banned
    if (user.banned) {
      return NextResponse.json(
        { error: "Account is banned. Please contact support." },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        success: true, 
        message: "Login successful", 
        user: userWithoutPassword,
        redirectTo: user.role === 'admin' ? "/admin/dashboard" : "/dashboard"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }
}
