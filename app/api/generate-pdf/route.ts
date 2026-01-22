import { NextRequest, NextResponse } from "next/server";
import { generatePDFBlob } from "@/app/dashboard/user/SuratPernyataan/services/pdfService";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate data
    if (!data || !data.pewaris || !data.ahliWaris) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    // Generate PDF
    const pdfBlob = await generatePDFBlob(data);

    // Convert blob to buffer
    const pdfBuffer = await pdfBlob.arrayBuffer();

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="surat-pernyataan-ahli-waris.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
