'use client';

import { FormValues } from '../types';
import { registerPdfFonts } from '@/app/lib/pdfFonts';

export async function generatePDFBlob(data: FormValues): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation must run on client side');
  }

    registerPdfFonts();

  const { pdf } = await import('@react-pdf/renderer');
  const SuratPernyataanPDF = (await import('../components/SuratPernyataanPDF')).default;

  const document = <SuratPernyataanPDF data={data} kondisiId={data.kondisi} />;

  const blob = await pdf(document).toBlob();
  return blob;
}

export async function downloadPDF(
  data: FormValues,
  filename = 'surat-pernyataan-ahli-waris.pdf'
) {
  const blob = await generatePDFBlob(data);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export async function openPDFInNewTab(data: FormValues) {
  const blob = await generatePDFBlob(data);
  const url = URL.createObjectURL(blob);

  const win = window.open(url, '_blank');
  if (!win) {
    throw new Error('Popup diblokir browser');
  }

  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
