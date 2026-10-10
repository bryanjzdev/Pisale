import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // Si está logueado y trata de entrar a login/register, mándalo al dashboard
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si NO está logueado y trata de entrar al dashboard, mándalo a login
  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configura en qué rutas queremos que este middleware se active
export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
