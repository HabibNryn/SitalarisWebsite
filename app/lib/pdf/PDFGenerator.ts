// /lib/pdf/PDFGenerator.ts
import { FormValues } from "@/app/dashboard/SuratPernyataan/types";
import { ComponentType } from 'react';

export interface PDFTemplateProps {
  data: FormValues;
}

export type PDFTemplateComponentType = ComponentType<PDFTemplateProps>;

export interface DownloadResult {
  success: boolean;
  error?: string;
  downloadUrl?: string;
}

export class PDFGenerator {
  /**
   * Generate dan download PDF langsung dari komponen
   */
  static async generateAndDownload(
    data: FormValues,
    TemplateComponent: PDFTemplateComponentType,
    filename?: string
  ): Promise<DownloadResult> {
    try {
      // Validasi data
      if (!this.isValidData(data)) {
        return {
          success: false,
          error: "Data tidak valid untuk membuat PDF"
        };
      }

      // Dynamic import
      const ReactPDF = await import('@react-pdf/renderer');
      const React = await import('react');
      
      // Buat komponen PDF
      const { Document, Page } = ReactPDF;
      
      // Render komponen menggunakan pdf()
      const pdfElement = React.createElement(
        Document,
        {},
        React.createElement(
          Page,
          { size: "A4", style: { padding: 30 } },
          React.createElement(TemplateComponent, { data })
        )
      );
      
      const pdfInstance = ReactPDF.pdf(pdfElement);
      const blob = await pdfInstance.toBlob();
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const finalFilename = filename || this.generateFilename(data);
      this.triggerDownload(url, finalFilename);
      
      return {
        success: true,
        downloadUrl: url,
        error: undefined
      };
      
    } catch (error: unknown) {
      console.error("PDF generation error:", error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }
  
  static triggerDownload(downloadUrl: string, filename: string): void {
    if (!downloadUrl || !filename) {
      console.error('downloadUrl dan filename harus diisi');
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup setelah download
      setTimeout(() => {
        try {
          URL.revokeObjectURL(downloadUrl);
        } catch (cleanupError) {
          console.warn('Gagal membersihkan URL:', cleanupError);
        }
      }, 60000);
    } catch (error) {
      console.error('Error triggering download:', error);
    }
  }

  /**
   * Format data untuk template PDF
   */
  static formatDataForPDF(data: FormValues): {
    formattedData: Record<string, unknown>;
    metadata: {
      generatedAt: string;
      pageCount: number;
      kondisiLabel: string;
    };
  } {
    return {
      formattedData: {
        ...data,
        tanggalGenerate: new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        totalAhliWaris: data.ahliWaris?.length || 0
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        pageCount: 1,
        kondisiLabel: this.getKondisiLabel(data.kondisi)
      }
    };
  }

  static getKondisiLabel(kondisi: string): string {
    const kondisiMap: Record<string, string> = {
      'kondisi1': 'Pewaris memiliki 1 istri dan semua anak masih hidup',
      'kondisi2': 'Pewaris memiliki 1 istri dan ada anak yang meninggal',
      'kondisi3': 'Pewaris memiliki 1 istri, ada anak yang meninggal dan memiliki cucu',
      'kondisi4': 'Pewaris menikah 2 kali',
      'kondisi5': 'Suami pewaris masih hidup',
      'kondisi6': 'Pewaris tidak memiliki keturunan',
      'kondisi7': 'Pewaris tidak memiliki keturunan dan hanya memiliki saudara kandung',
    };
    return kondisiMap[kondisi] || 'Kondisi tidak diketahui';
  }

  /**
   * Generate nama file PDF
   */
  static generateFilename(data: FormValues): string {
    const name = (data.dataPewaris?.nama || 'unknown')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50);
    
    const date = new Date().toISOString().split('T')[0];
    const kondisi = (data.kondisi || '').replace('kondisi', 'k');
    
    return `surat-pernyataan-ahli-waris-${name}-${kondisi}-${date}.pdf`;
  }

  /**
   * Format tanggal ke format Indonesia
   */
  static formatTanggalIndo(dateString: string): string {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Validasi data
   */
  private static isValidData(data: unknown): data is FormValues {
    if (!data || typeof data !== 'object') return false;
    
    const formData = data as Partial<FormValues>;
    
    if (!formData.dataPewaris?.nama) return false;
    if (!formData.kondisi) return false;
    
    if (formData.kondisi !== "kondisi6" && (!formData.ahliWaris || formData.ahliWaris.length === 0)) {
      return false;
    }
    
    return true;
  }

  /**
   * Helper untuk error message
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Terjadi kesalahan yang tidak diketahui';
  }
}