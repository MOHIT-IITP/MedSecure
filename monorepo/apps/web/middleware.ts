import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Don't import Node-only modules in Edge middleware. Only check cookie existence here;
// route handlers should perform full token verification.

const protectedRoutes = [

  "/dashboard",

  "/profile",

  "/settings",

];

export function middleware(
  req: NextRequest
) {

  const token =
    req.cookies.get(
      "token"
    )?.value;

  const pathname =
    req.nextUrl.pathname;

  const isProtected =
    protectedRoutes.some(
      (route) =>
        pathname.startsWith(
          route
        )
    );

  if (!isProtected) {

    return NextResponse.next();
  }

  if (!token) {

    return NextResponse.redirect(
      new URL(
        "/login",
        req.url
      )
    );
  }

  // Don't validate the token in middleware (edge runtime). Route handlers verify it.
  return NextResponse.next();
}
export const config = {

  matcher: [

    "/dashboard/:path*",

    "/profile/:path*",

    "/settings/:path*",

  ],
};