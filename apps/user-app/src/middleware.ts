/* eslint-disable turbo/no-undeclared-env-vars */
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server"; // Import type

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req: req as any,
    secret: process.env.JWT_SECRET,
  });

  // Redirect unverified users to the /verify page
  // if (
  //   token &&
  //   token.verification === false &&
  //   req.nextUrl.pathname !== "/verify"
  // ) {
  //   return NextResponse.redirect(new URL("/verify", req.url));
  // }

  // If token is found, restrict access to /signin, /signup
  const restrictedRoutes = ["/signin", "/signup"];
  if (token && restrictedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/home", req.url)); // Redirect authenticated users to /home
  }

  // If token is not found, redirect to /signin when accessing protected pages
  const protectedRoutes = ["/home", "/transfer", "/transactions", "/verify"];
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Continue if conditions are met
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home",
    "/transfer",
    "/transactions",
    "/signin",
    "/signup",
    "/verify",
  ], // Middleware will run only for these routes
};
