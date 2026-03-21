import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken, sessionCookieName } from "@/lib/auth/session";

const adminPaths = ["/admin"];
const customerPaths = ["/account", "/cart", "/checkout"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(sessionCookieName)?.value;
  const isAdminProtected = adminPaths.some((path) => pathname.startsWith(path)) && pathname !== "/admin/login";
  const isCustomerProtected = customerPaths.some((path) => pathname.startsWith(path));

  if (!isAdminProtected && !isCustomerProtected) {
    return NextResponse.next();
  }

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = isAdminProtected ? "/admin/login" : "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const session = await verifyAuthToken(token);
    if (isAdminProtected && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (isCustomerProtected && session.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = isAdminProtected ? "/admin/login" : "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/cart/:path*", "/checkout/:path*"],
};
