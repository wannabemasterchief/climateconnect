import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition for protected routes
  if (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/partnerships/create") ||
    req.nextUrl.pathname.startsWith("/events/create")
  ) {
    // If user is not signed in and is trying to access a protected route
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/auth/login"
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/partnerships/create/:path*", "/events/create/:path*"],
}
