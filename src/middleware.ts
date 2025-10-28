import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session token from Better Auth cookies
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  
  // If user has session token and trying to access auth pages, redirect to main page
  if (sessionToken) {
    if (pathname === "/login" || pathname === "/sign-up") {
      // Redirect authenticated users to main page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  // Protect admin routes - require authentication and admin role
  // if (pathname.startsWith("/admin")) {
  //   if (!sessionToken) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }
    // Note: Role checking should be done in the admin layout component
    // since middleware doesn't have access to user data from database
  
  // Protect dashboard routes - require authentication
  if (pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  // Allow all other routes (API routes, public pages, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login", 
    "/sign-up",
    "/admin/:path*"
  ],
};
