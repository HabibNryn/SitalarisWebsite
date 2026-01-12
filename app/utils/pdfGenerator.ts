import React from 'react';
import { FormValues } from "../dashboard/SuratPernyataan/page";

export class PDFGenerator {
  static generateSuratPernyataan(data: FormValues): string {
    // Ini akan mengembalikan URL untuk download PDF
    // Dalam implementasi nyata, Anda akan menggunakan jspdf atau @react-pdf/renderer
    
    console.log("Generating PDF with data:", data);
    
    // Simulasi URL PDF
    return `/api/generate-pdf?data=${encodeURIComponent(JSON.stringify(data))}`;
  }

  static async downloadPDF(data: FormValues, filename: string = "surat-pernyataan-warisan.pdf") {
    try {
      // Menggunakan @react-pdf/renderer untuk generate PDF
      const { pdf, Document } = await import('@react-pdf/renderer');
      const PernyataanWarisanPDF = await import('../components/PernyataanWarisanPDF').then(m => m.default);
      
      const blob = await pdf(React.createElement(Document, {}, React.createElement(PernyataanWarisanPDF, { data }))).toBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return false;
    }
  }

  static formatDataForTemplate(data: FormValues): any {
    // Format data sesuai template surat
    return {
      tanggal: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      dataPewaris: {
        ...data.dataPewaris,
        tanggalLahirFormatted: this.formatDateIndo(data.dataPewaris.tanggalLahir),
        tanggalMeninggalFormatted: this.formatDateIndo(data.dataPewaris.tanggalMeninggal)
      },
      ahliWaris: data.ahliWaris.map(ahli => ({
        ...ahli,
        tanggalLahirFormatted: this.formatDateIndo(ahli.tanggalLahir),
        statusHidup: ahli.masihHidup ? "Masih Hidup" : "Meninggal"
      })),
      kondisi: data.kondisi,
      keterangan: data.tambahanKeterangan || "-"
    };
  }

  private static formatDateIndo(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
  }
}