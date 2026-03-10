import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// routes ที่ไม่ต้อง login
const PUBLIC_ROUTES = ["/auth"];

export function proxy(request: NextRequest) {
  const session = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // ไม่มี session และไม่ใช่ public route → redirect ไป login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // มี session แล้วพยายามเข้า /auth → redirect ไป dashboard
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
