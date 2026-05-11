import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/", "/login", "/create-company"];

  const isPublicRoute = publicRoutes.includes(pathname);

  const isAuthApi = pathname.startsWith("/api/auth");

  if (isAuthApi) return;

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
