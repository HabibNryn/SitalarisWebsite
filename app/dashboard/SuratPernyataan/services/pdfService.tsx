import { PDFDocument } from 'pdf-lib';
import { FormValues } from '../types';

export async function generatePDFBlob(data: FormValues): Promise<Blob> {
  // Menggunakan react-pdf
  const { pdf } = await import('@react-pdf/renderer');
  const SuratPernyataanPDF = (await import('../components/SuratPernyataanPDF')).default;
  
  const pdfDocument = (
    <SuratPernyataanPDF data={data} />
  );
  
  const blob = await pdf(pdfDocument).toBlob();
  return blob;
}

export async function downloadPDF(data: FormValues, filename: string = 'surat-pernyataan-ahli-waris.pdf') {
  try {
    const blob = await generatePDFBlob(data);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export async function openPDFInNewTab(data: FormValues) {
  try {
    const blob = await generatePDFBlob(data);
    const url = URL.createObjectURL(blob);
    
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      alert('Popup blocked! Please allow popups for this site.');
    }
    
    // Clean up after a while
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error('Error opening PDF:', error);
    throw error;
  }
}