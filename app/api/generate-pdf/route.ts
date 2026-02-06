import { NextRequest, NextResponse } from "next/server";
import {
  buildSuratPernyataanFormValues,
  getSuratPernyataanPdfFilename,
  isSuratPernyataanPdfDataValid,
} from "@/app/lib/pdf/submissionMapper";
import { renderSuratPernyataanPdfBuffer } from "@/app/lib/pdf/suratPernyataanPdf";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const pdfData = buildSuratPernyataanFormValues(data);

    if (!isSuratPernyataanPdfDataValid(pdfData)) {
      return NextResponse.json(
        { error: "Data tidak lengkap untuk membuat PDF" },
        { status: 400 },
      );
    }

    const buffer = await renderSuratPernyataanPdfBuffer(pdfData);
    const filename = getSuratPernyataanPdfFilename(data);

return new NextResponse(
  new Uint8Array(buffer),
  {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  }
);

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
