// app/api/download/[letterId]/route.ts
// Endpoint untuk mengunduh PDF surat. Dipakai sebagai link download di email
// notifikasi ketika file PDF tidak dapat dilampirkan langsung.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readPdfFromDisk, extractPdfFilename } from "@/lib/letter-pdf";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ letterId: string }> },
) {
  try {
    const { letterId } = await params;

    const letter = await prisma.suratPernyataan.findUnique({
      where: { id: letterId },
      select: {
        id: true,
        nomorSurat: true,
        pdfUrl: true,
        pdfFileName: true,
        status: true,
      },
    });

    if (!letter) {
      return NextResponse.json(
        { error: "Surat tidak ditemukan" },
        { status: 404 },
      );
    }

    // Coba baca PDF dari penyimpanan lokal
    const resolved = await readPdfFromDisk(letter.pdfUrl, letter.pdfFileName);

    if (resolved) {
      return new NextResponse(new Uint8Array(resolved.buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${resolved.filename}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Fallback: generate PDF on-the-fly via /api/generate-pdf
    const fullLetter = await prisma.suratPernyataan.findUnique({
      where: { id: letterId },
    });

    if (!fullLetter) {
      return NextResponse.json(
        { error: "Surat tidak ditemukan" },
        { status: 404 },
      );
    }

    const pdfData = {
      kondisi: fullLetter.kondisi,
      dataPewaris: fullLetter.dataPewaris,
      ahliWaris: fullLetter.ahliWaris,
      tambahanKeterangan: fullLetter.tambahanKeterangan || "",
    };

    const origin = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000")
      .origin;

    const response = await fetch(`${origin}/api/generate-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pdfData),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "File PDF tidak tersedia" },
        { status: 404 },
      );
    }

    const pdfBuffer = await response.arrayBuffer();
    const filename =
      extractPdfFilename(letter.pdfFileName) ||
      `surat-${letter.nomorSurat}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download PDF error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengunduh PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
