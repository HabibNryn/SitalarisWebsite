import { NextResponse } from 'next/server';
import { renderSuratPernyataanHTML } from '@/app/pdf/templates/surat-pernyataan-ahli-waris';
import { generatePDF } from '@/app/lib/pdf';

export async function POST(req: Request) {
  const data = await req.json();

  const html = renderSuratPernyataanHTML(data);
  const fileName = `surat-pernyataan-${Date.now()}.pdf`;

  const path = await generatePDF(html, fileName);

  return NextResponse.json({
    success: true,
    fileName,
    path,
  });
}
