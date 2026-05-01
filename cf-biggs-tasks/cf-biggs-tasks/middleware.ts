import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/tasks", "/calendar", "/settings"];

export function middleware(req: NextRequest) {
  const session = req.cookies.get("cf_biggs_session")?.value;
  const isProtected = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
