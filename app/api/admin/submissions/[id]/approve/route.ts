import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { storageService } from "@/lib/storage";
import { sendApprovalEmail } from "@/lib/email";
import { generateSuratPernyataanPDF } from "@/lib/pdf-generator";
import { z } from "zod";

/* =========================
   IMPORT SHARED SCHEMAS
========================= */
import {
  KondisiEnum,
  dataPewarisSchema,
  dataKeluargaSchema,
  DataPewarisType,
  DataKeluargaType,
} from "@/app/dashboard/user/SuratPernyataan/constants/schemas";

/* =========================
   HELPER
========================= */
function parsePrismaJson<T>(
  schema: z.ZodType<T>,
  value: unknown,
): T {
  return schema.parse(value);
}

/* =========================
   POST APPROVE HANDLER
========================= */
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    /* =========================
       AUTHORIZATION
    ========================= */
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    /* =========================
       FETCH SUBMISSION
    ========================= */
    const submission = await prisma.suratPernyataan.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    /* =========================
       PARSE DATABASE JSON
       (INI KUNCI UTAMA)
    ========================= */
    const kondisi = KondisiEnum.parse(submission.kondisi);

    const dataPewaris: DataPewarisType = parsePrismaJson(
      dataPewarisSchema,
      submission.dataPewaris,
    );

    const ahliWaris: DataKeluargaType[] = parsePrismaJson(
      z.array(dataKeluargaSchema),
      submission.ahliWaris,
    );

    /* =========================
       GENERATE PDF
    ========================= */
    const pdfBuffer = await generateSuratPernyataanPDF(
      {
        kondisi,
        dataPewaris,
        ahliWaris,
        tambahanKeterangan: submission.reviewNotes ?? "",
      },
      submission.nomorSurat,
    );

    /* =========================
       UPLOAD PDF
    ========================= */
    const fileName = `surat-pernyataan-${submission.nomorSurat}.pdf`;

    const pdfUrl = await storageService.uploadFile(
      fileName,
      Buffer.from(pdfBuffer),
    );

    /* =========================
       UPDATE SUBMISSION
    ========================= */
    const updatedSubmission = await prisma.suratPernyataan.update({
      where: { id: submission.id },
      data: {
        status: "APPROVED",
        pdfUrl,
        isGenerated: true,
        pdfGeneratedBy: session.user.id,
        pdfLastGenerated: new Date(),
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });

    /* =========================
       SEND EMAIL (NON-BLOCKING)
    ========================= */
    if (submission.user.email) {
      sendApprovalEmail(
        submission.user.email,
        submission.user.name || "Pemohon",
        submission.nomorSurat,
        Buffer.from(pdfBuffer),
      ).catch((err) => {
        console.error("Email send failed:", err);
      });
    }

    /* =========================
       RESPONSE
    ========================= */
    return NextResponse.json({
      success: true,
      message: "Surat berhasil disetujui dan PDF diterbitkan",
      data: updatedSubmission,
    });
  } catch (error) {
    console.error("Approve submission error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Data tidak valid",
          details: error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Gagal menyetujui surat pernyataan" },
      { status: 500 },
    );
  }
}
