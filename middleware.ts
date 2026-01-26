// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // ======================
    // NOT AUTHENTICATED
    // ======================
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const isAdmin = token.isAdmin === true;

    // ======================
    // ADMIN AREA
    // ======================
    if (pathname.startsWith("/dashboard/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard/user", req.url));
      }
    }

    // ======================
    // USER AREA
    // ======================
    if (pathname.startsWith("/dashboard/user")) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
    }

    // ======================
    // ROOT DASHBOARD
    // ======================
    if (pathname === "/dashboard") {
      return NextResponse.redirect(
        new URL(isAdmin ? "/dashboard/admin" : "/dashboard/user", req.url),
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // HARD GUARD
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
