// /app/api/surat-pernyataan/progress/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        suratPernyataan: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            permohonan: {
              select: {
                statusPermohonan: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.suratPernyataan.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Belum ada pengajuan",
      });
    }

    const latestPengajuan = user.suratPernyataan[0];

    const permohonanStatus = latestPengajuan.permohonan?.statusPermohonan || null;

    const isRejected = latestPengajuan.status === "REJECTED";

    // Tentukan current step berdasarkan status surat + permohonan
    let currentStep = 1;
    if (isRejected) {
      currentStep = 2;
    } else if (latestPengajuan.status === "SUBMITTED") {
      currentStep = 2;
    } else if (
      latestPengajuan.status === "VERIFIED" ||
      latestPengajuan.status === "APPROVED"
    ) {
      if (permohonanStatus === "COMPLETED") {
        currentStep = 5;
      } else if (
        permohonanStatus === "IN_REVIEW" ||
        permohonanStatus === "APPROVED"
      ) {
        currentStep = 4;
      } else {
        currentStep = 3;
      }
    } else if (latestPengajuan.status === "COMPLETED") {
      currentStep = 5;
    }

    // Data progress
    const progressData = {
      step1: {
        status: "completed",
        date: latestPengajuan.createdAt.toISOString(),
      },
      step2: {
        status: isRejected
          ? "completed"
          : latestPengajuan.status === "SUBMITTED"
            ? "current"
            : ["VERIFIED", "APPROVED", "COMPLETED"].includes(
                  latestPengajuan.status,
                )
              ? "completed"
              : "pending",
        date:
          latestPengajuan.reviewedAt?.toISOString() ||
          latestPengajuan.submittedAt?.toISOString() ||
          null,
      },
      step3: {
        status: isRejected
          ? "pending"
          : latestPengajuan.status === "VERIFIED" ||
              latestPengajuan.status === "APPROVED"
            ? permohonanStatus
              ? ["IN_REVIEW", "APPROVED", "COMPLETED"].includes(permohonanStatus)
                ? "completed"
                : "current"
              : "current"
            : "pending",
        date: isRejected
          ? null
          : latestPengajuan.verifiedAt?.toISOString() ||
            latestPengajuan.approvedAt?.toISOString() ||
            null,
      },
      step4: {
        status: isRejected
          ? "pending"
          : permohonanStatus === "IN_REVIEW" || permohonanStatus === "APPROVED"
            ? "current"
            : permohonanStatus === "COMPLETED"
              ? "completed"
              : "pending",
        date: isRejected ? null : latestPengajuan.approvedAt?.toISOString() || null,
      },
      step5: {
        status: isRejected
          ? "pending"
          : permohonanStatus === "COMPLETED" ||
              latestPengajuan.status === "COMPLETED"
            ? "completed"
            : "pending",
        date: isRejected
          ? null
          : latestPengajuan.completedAt?.toISOString() ||
            latestPengajuan.permohonan?.updatedAt?.toISOString() ||
            null,
      },
    };

    return NextResponse.json({
      success: true,
      currentStep,
      pengajuanId: latestPengajuan.id,
      progress: progressData,
      pengajuan: latestPengajuan,
      rejection: isRejected
        ? {
            reason: latestPengajuan.reviewNotes || null,
            reviewedAt: latestPengajuan.reviewedAt?.toISOString() || null,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
