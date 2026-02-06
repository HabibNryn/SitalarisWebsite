// app/api/admin/submissions/[id]/pdf/download/route.ts
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
    
    console.log(`Download PDF for submission: ${id}`);
    
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
    
    const ahliWarisCount = Array.isArray(pdfData.ahliWaris)
  ? pdfData.ahliWaris.length
  : 0;

    console.log('PDF data prepared:', {
      hasDataPewaris: !!pdfData.dataPewaris,
      ahliWarisCount: ahliWarisCount,
    });
    
    // Panggil API generate-pdf
    const response = await fetch(`${request.nextUrl.origin}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pdfData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PDF generation failed:', errorText);
      throw new Error(`PDF generation failed: ${response.status}`);
    }
    
    const pdfBuffer = await response.arrayBuffer();
    
    // Update download count
    await prisma.suratPernyataan.update({
      where: { id },
      data: { downloadCount: { increment: 1 } }
    });
    
    // Log activity
    await prisma.documentLog.create({
      data: {
        suratPernyataanId: id,
        userId: session.user.id,
        action: "DOWNLOAD",
        details: `PDF downloaded by admin`,
      },
    });
    
    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="surat-pernyataan-${submission.nomorSurat}.pdf"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
    
  } catch (error) {
    console.error("PDF download error:", error);
    return NextResponse.json(
      { 
        error: "Failed to download PDF",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}