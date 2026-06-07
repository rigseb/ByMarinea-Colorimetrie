import { NextResponse } from "next/server";

export function middleware(request) {

  const { pathname } = request.nextUrl;

  // ✅ AUTORISER LES FICHIERS STATIQUES (TRÈS IMPORTANT)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp")
  ) {
    return NextResponse.next();
  }

  // ✅ AUTORISER LA PAGE LOGIN
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // ✅ VÉRIFIER COOKIE AUTHENTIFICATION
  const isLogged = request.cookies.get("auth")?.value === "true";

  if (!isLogged) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ✅ APPLIQUER À TOUTE L’APP
export const config = {
  matcher: "/:path*",
};
