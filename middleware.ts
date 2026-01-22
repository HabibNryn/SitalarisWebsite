// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // ======================
    // ADMIN DASHBOARD
    // ======================
    if (pathname.startsWith("/dashboard/admin")) {
      const isAdmin =
        token?.isAdmin === true ||
        token?.role === "ADMIN" ||
        token?.role === "SUPER_ADMIN";

      if (!isAdmin) {
        return NextResponse.redirect(
          new URL("/dashboard/user", req.url),
        );
      }
    }

    // ======================
    // USER DASHBOARD
    // ======================
    if (pathname.startsWith("/dashboard/user")) {
      if (!token) {
        return NextResponse.redirect(
          new URL("/login", req.url),
        );
      }
    }

    // ======================
    // ROOT DASHBOARD REDIRECT
    // ======================
    if (pathname === "/dashboard" && token) {
      const isAdmin =
        token.isAdmin === true ||
        token.role === "ADMIN" ||
        token.role === "SUPER_ADMIN";

      return NextResponse.redirect(
        new URL(
          isAdmin ? "/dashboard/admin" : "/dashboard/user",
          req.url,
        ),
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        const pathname = req.nextUrl.pathname;

        // PUBLIC ROUTES
        if (
          pathname === "/" ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/api/auth")
        ) {
          return true;
        }

        // PROTECTED ROUTES
        if (pathname.startsWith("/dashboard")) {
          return true;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
