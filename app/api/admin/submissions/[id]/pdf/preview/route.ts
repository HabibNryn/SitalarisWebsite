// app/api/admin/submissions/[id]/pdf/preview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth-options";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Unwrap params
    const { id } = await params;
    
    console.log(`Preview PDF for submission: ${id}`);
    
    const submission = await prisma.suratPernyataan.findUnique({
      where: { id },
    });
    
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    
    // Format data untuk PDF
    const pdfData = {
      kondisi: submission.kondisi,
      dataPewaris: submission.dataPewaris,
      ahliWaris: submission.ahliWaris,
      tambahanKeterangan: submission.tambahanKeterangan || '',
    };
    
    // Generate URL untuk preview
    const previewUrl = new URL('/api/generate-pdf', request.url);
    
    // Untuk preview, kita bisa menggunakan GET dengan query parameter
    // atau POST dengan redirect. Pilih salah satu:
    
    // Option 1: Redirect ke generate-pdf dengan data di query (untuk data kecil)
    if (JSON.stringify(pdfData).length < 2000) {
      previewUrl.searchParams.set('data', encodeURIComponent(JSON.stringify(pdfData)));
      previewUrl.searchParams.set('preview', 'true');
      return NextResponse.redirect(previewUrl);
    }
    
    // Option 2: Buat endpoint khusus untuk preview yang return PDF dengan header berbeda
    const response = await fetch(`${request.nextUrl.origin}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pdfData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate preview');
    }
    
    const pdfBuffer = await response.arrayBuffer();
    
    // Untuk preview, gunakan inline attachment
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="preview-${submission.nomorSurat}.pdf"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
    
  } catch (error) {
    console.error("PDF preview error:", error);
    return NextResponse.json(
      { 
        error: "Failed to preview PDF",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}