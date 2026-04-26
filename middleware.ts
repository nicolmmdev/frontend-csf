import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token2")?.value;
console.log("TOKEN:", request.cookies);
  const { pathname } = request.nextUrl;

  const isLogin = pathname === "/login";
  const isRoot = pathname === "/";
  const isProtected =
    pathname.startsWith("/compras") ||
    pathname.startsWith("/ventas") ||
    pathname.startsWith("/productos") ||

    pathname.startsWith("/kardex");

  // 🔴 NO LOGUEADO
  if (!token) {
    if (isLogin) return NextResponse.next();

    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🟢 LOGUEADO
  if (token) {
    if (isLogin || isRoot) {
      return NextResponse.redirect(new URL("/compras", request.url));
    }

    // 🔥 permitir acceso a protegidas
    if (isProtected) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/compras/:path*", "/ventas/:path*", "/kardex/:path*",  "/productos/:path*"],
};