import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // 로그인 페이지는 항상 접근 가능
  if (req.nextUrl.pathname.startsWith("/login")) {
    return res;
  }
  //로그인 하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return res;
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
