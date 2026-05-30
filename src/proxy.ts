import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/", "/login", "/onboarding", "/auth/redirect"];

  const isPublicRoute = publicRoutes.includes(pathname);

  const isAuthApi = pathname.startsWith("/api/auth");

  const isApiRoute = pathname.startsWith("/api");

  if (isAuthApi || isApiRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
