import { auth } from "@/auth/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === "/login"
  const isAuthApi = req.nextUrl.pathname.startsWith("/api/auth")

  // NextAuth 내부 API는 건드리지 말기
  if (isAuthApi) return

  // 로그인 안 했고, login 페이지도 아니면 리디렉트
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}