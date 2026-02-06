// middleware.ts - VERSI YANG DIPERBARUI
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // ======================
    // NOT AUTHENTICATED
    // ======================
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const isAdmin = token.isAdmin === true;
    const userId = token.id || token.sub; // Pastikan ini sesuai dengan token structure Anda

    // ======================
    // PROTECT SURAT PERMOHONAN ACCESS
    // ======================
    if (pathname.startsWith("/dashboard/user/SuratPermohonan")) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }

      // Cek apakah user memiliki akses ke form permohonan
      try {
        const suratPernyataan = await prisma.suratPernyataan.findFirst({
          where: {
            userId: userId,
            status: 'APPROVED',
            can_access_permohonan: true
          },
          select: {
            id: true,
            reviewedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        if (!suratPernyataan) {
          // Cek status terakhir untuk memberikan feedback yang lebih baik
          const lastSubmission = await prisma.suratPernyataan.findFirst({
            where: {
              userId: userId
            },
            select: {
              status: true,
              createdAt: true,
              catatan: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          });

          const redirectUrl = new URL('/dashboard/user/status', req.url);
          redirectUrl.searchParams.set('error', 'no-access');

          if (lastSubmission) {
            if (lastSubmission.status === 'SUBMITTED') {
              redirectUrl.searchParams.set('message', 'Surat pernyataan Anda masih dalam proses verifikasi admin');
            } else if (lastSubmission.status === 'REJECTED') {
              redirectUrl.searchParams.set('message', `Surat pernyataan Anda ditolak. ${lastSubmission.catatan ? `Alasan: ${lastSubmission.catatan}` : ''}`);
            } else {
              redirectUrl.searchParams.set('message', 'Anda belum mendapatkan akses untuk mengisi form permohonan');
            }
          }

          return NextResponse.redirect(redirectUrl);
        }
      } catch (error) {
        console.error('Middleware database error:', error);
        // Jika terjadi error, redirect ke status page dengan error
        const redirectUrl = new URL('/dashboard/user/status', req.url);
        redirectUrl.searchParams.set('error', 'system-error');
        redirectUrl.searchParams.set('message', 'Terjadi kesalahan sistem. Silakan coba lagi nanti.');
        return NextResponse.redirect(redirectUrl);
      }
    }

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
  matcher: [
    "/dashboard/:path*",
    "/dashboard/user/SuratPermohonan/:path*"
  ],
};
