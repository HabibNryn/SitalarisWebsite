// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Auth & role guard
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true, role: true },
    });

    if (
      !adminUser?.isAdmin &&
      !["admin", "super_admin"].includes(adminUser?.role ?? "")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Number(searchParams.get("limit") ?? 10), 50);
    const skip = (page - 1) * limit;
    const search = searchParams.get("search")?.trim();

    // Build where clause
    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Ambil user + agregasi surat.
    // Optimasi N+1: gunakan `_count` untuk total surat dan `take: 1`
    // pada include agar hanya mengambil 1 surat terbaru per user,
    // bukan seluruh surat (yang bisa ratusan baris per user).
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: { select: { suratPernyataan: true } },
          suratPernyataan: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              status: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const data = users.map((u) => {
      const latest = u.suratPernyataan[0] ?? null;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt.toISOString(),
        totalLetters: u._count?.suratPernyataan ?? 0,
        latestStatus: latest?.status ?? null,
        latestLetterAt: latest?.createdAt.toISOString() ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get admin users error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengambil daftar pengguna",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
