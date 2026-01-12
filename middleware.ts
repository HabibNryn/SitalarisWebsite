import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Khusus route admin
    if (path.startsWith("/admin")) {
      if (!token?.isAdmin) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Khusus route admin biasa
    if (path.startsWith("/dashboard/admin")) {
      if (token?.role !== "admin" && token?.role !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Khusus route super admin
    if (path.startsWith("/dashboard/admin/super")) {
      if (token?.role !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/permohonan/:path*",
    "/admin/:path*",
  ],
};