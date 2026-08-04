// app/api/admin/users/[userId]/letters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { Prisma, StatusSurat } from "@prisma/client";

const VALID_STATUSES: StatusSurat[] = [
  "DRAFT",
  "SUBMITTED",
  "VERIFIED",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
  "EXPIRED",
  "COMPLETED",
  "SENT",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

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

    // Ambil user yang dituju
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        phone: true,
        isActive: true,
        role: true,
        _count: { select: { suratPernyataan: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    // Filter status
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const where: Prisma.SuratPernyataanWhereInput = { userId };
    if (statusFilter && statusFilter !== "ALL") {
      if ((VALID_STATUSES as string[]).includes(statusFilter)) {
        where.status = statusFilter as StatusSurat;
      }
    }

    const letters = await prisma.suratPernyataan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nomorSurat: true,
        kondisi: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        pdfUrl: true,
        pdfFileName: true,
        sentAt: true,
        isGenerated: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          phone: user.phone,
          isActive: user.isActive,
          role: user.role,
          totalLetters: user._count.suratPernyataan,
        },
        letters: letters.map((l) => ({
          id: l.id,
          nomorSurat: l.nomorSurat,
          kondisi: l.kondisi,
          status: l.status,
          createdAt: l.createdAt.toISOString(),
          updatedAt: l.updatedAt.toISOString(),
          pdfUrl: l.pdfUrl,
          pdfFileName: l.pdfFileName,
          sentAt: l.sentAt?.toISOString() ?? null,
          isGenerated: l.isGenerated,
        })),
      },
    });
  } catch (error) {
    console.error("Get user letters error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengambil surat pengguna",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
