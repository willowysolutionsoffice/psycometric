import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/user-schema";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Check user exists and is admin, and password matches
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || (user.role ?? "").toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Only admin can login here" }, { status: 403 });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create a lightweight admin session cookie for admin routes
    const res = NextResponse.json({ success: true });
    const oneDay = 60 * 60 * 24;
    res.cookies.set("admin_session", crypto.randomUUID(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: oneDay,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 401 });
  }
}


