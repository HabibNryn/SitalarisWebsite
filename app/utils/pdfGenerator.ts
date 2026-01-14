// /lib/pdf/PDFGenerator.ts - Perbaiki dengan async/await yang benar
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
   * Generate dan download PDF dengan timeout untuk mencegah blocking
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

      // Gunakan Promise.race untuk timeout (30 detik)
      return await Promise.race([
        this._generatePDF(data, TemplateComponent, filename),
        this._timeout(30000, "PDF generation timeout setelah 30 detik")
      ]);
      
    } catch (error: unknown) {
      console.error("PDF generation error:", error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Private method untuk generate PDF dengan error handling
   */
  private static async _generatePDF(
    data: FormValues,
    TemplateComponent: PDFTemplateComponentType,
    filename?: string
  ): Promise<DownloadResult> {
    try {
      // Dynamic import untuk menghindari SSR issues
      const ReactPDF = await import('@react-pdf/renderer');
      const React = await import('react');
      
      const { Document, Page, pdf } = ReactPDF;
      
      // Buat komponen PDF
      const pdfElement = React.createElement(
        Document,
        {},
        React.createElement(
          Page,
          { size: "A4", style: { padding: 30 } },
          React.createElement(TemplateComponent, { data })
        )
      );
      
      // Render PDF ke blob
      const pdfInstance = pdf(pdfElement);
      const blob = await pdfInstance.toBlob();
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Trigger download jika ada filename
      if (filename) {
        this._triggerDownload(url, filename);
      }
      
      return {
        success: true,
        downloadUrl: url
      };
      
    } catch (error: unknown) {
      throw error;
    }
  }

  /**
   * Helper untuk timeout
   */
  private static async _timeout(ms: number, message: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    });
  }

  /**
   * Helper untuk trigger download
   */
  private static _triggerDownload(downloadUrl: string, filename: string): void {
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
      
      // Cleanup setelah 1 menit
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

  // ... (sisanya tetap sama - generateFilename, getKondisiLabel, dll)
}