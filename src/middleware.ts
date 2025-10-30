import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session token from Better Auth cookies
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  const adminSession = request.cookies.get("admin_session")?.value;
  
  // If user has session token and trying to access public auth pages, redirect to main page
  if (sessionToken && (pathname === "/login" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin auth page handling
  const isAdminAuthPage = pathname === "/admin/login"; // route group (auth) resolves to /admin/login
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminAuthPage;

  // If already authenticated and hits admin login, send to dashboard
  if ((sessionToken || adminSession) && isAdminAuthPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protect admin routes: require authentication
  if (!(sessionToken || adminSession) && isAdminRoute) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  
  // Protect admin routes - require authentication and admin role
  // if (pathname.startsWith("/admin")) {
  //   if (!sessionToken) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }
    // Note: Role checking should be done in the admin layout component
    // since middleware doesn't have access to user data from database
  
  // Protect user dashboard routes - require authentication
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
