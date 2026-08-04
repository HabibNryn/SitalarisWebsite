// app/api/admin/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { sendCompletedLetterEmail } from "@/lib/email";
import { readPdfFromDisk, extractPdfFilename } from "@/lib/letter-pdf";

export async function POST(request: NextRequest) {
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

    // Parse body
    const body = await request.json().catch(() => null);
    const letterId = body?.letterId as string | undefined;

    if (!letterId) {
      return NextResponse.json(
        { error: "letterId wajib diisi" },
        { status: 400 },
      );
    }

    // Ambil surat + user terkait
    const letter = await prisma.suratPernyataan.findUnique({
      where: { id: letterId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!letter) {
      return NextResponse.json(
        { error: "Surat tidak ditemukan" },
        { status: 404 },
      );
    }

    // Validasi: hanya status COMPLETED yang bisa dikirim email
    if (letter.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: `Email hanya dapat dikirim untuk surat berstatus COMPLETED. Status saat ini: ${letter.status}`,
        },
        { status: 400 },
      );
    }

    if (!letter.user.email) {
      return NextResponse.json(
        { error: "Pengguna tidak memiliki alamat email" },
        { status: 400 },
      );
    }

    // Siapkan attachment PDF (jika tersedia di server)
    const resolvedPdf = await readPdfFromDisk(
      letter.pdfUrl,
      letter.pdfFileName,
    );
    const pdfFilename =
      resolvedPdf?.filename ||
      extractPdfFilename(letter.pdfFileName) ||
      undefined;

    // Build absolute download URL (fallback jika PDF tidak tersedia)
    let downloadUrl: string | undefined;
    try {
      downloadUrl = new URL(
        `/api/download/${letter.id}`,
        request.url,
      ).toString();
    } catch {
      downloadUrl = `/api/download/${letter.id}`;
    }

    // Kirim email
    const emailInfo = await sendCompletedLetterEmail({
      to: letter.user.email,
      userName: letter.user.name,
      letterTitle: letter.nomorSurat,
      nomorSurat: letter.nomorSurat,
      pdfBuffer: resolvedPdf?.buffer,
      pdfFilename,
      downloadUrl,
    });

    // Update status menjadi SENT dan catat waktu pengiriman
    const updated = await prisma.suratPernyataan.update({
      where: { id: letter.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        sentAt: true,
      },
    });

    // Catat activity log
    await prisma.documentLog
      .create({
        data: {
          suratPernyataanId: letter.id,
          userId: session.user.id,
          action: "STATUS_CHANGE",
          details: `Email notifikasi selesai dikirim ke ${letter.user.email} (status -> SENT)`,
        },
      })
      .catch((err) =>
        console.error("Failed to create document log for email send:", err),
      );

    return NextResponse.json({
      success: true,
      data: {
        letterId: updated.id,
        status: updated.status,
        sentAt: updated.sentAt?.toISOString() ?? null,
        messageId: emailInfo.messageId ?? null,
      },
      message: "Email berhasil dikirim",
    });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengirim email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
