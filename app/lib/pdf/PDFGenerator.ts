// /lib/pdf/PDFGenerator.ts
import { FormValues } from "@/app/dashboard/SuratPernyataan/types";
import { ReactElement, ComponentType, JSXElementConstructor, ReactNode } from 'react';

// Type untuk PDF document element yang sesuai dengan @react-pdf/renderer
export type PDFDocumentElement = ReactElement<
  {
    children?: ReactNode;
    [key: string]: unknown;
  },
  string | JSXElementConstructor<unknown>
>;

export interface DownloadResult {
  success: boolean;
  error?: string;
  downloadUrl?: string;
}

// Tipe untuk React element dengan struktur dasar
interface BasicReactElement {
  type?: unknown;
  props?: {
    children?: ReactNode | ReactNode[];
    [key: string]: unknown;
  };
  key?: string | number | null;
  $$typeof?: symbol;
}

// Tipe untuk @react-pdf/renderer components (partial)
interface ReactPDFComponents {
  Document: ComponentType<{ children?: ReactNode }>;
  Page: ComponentType<{ 
    children?: ReactNode; 
    size?: string; 
    style?: Record<string, unknown> 
  }>;
  pdf: (element: ReactElement) => {
    toBlob: () => Promise<Blob>;
  };
}

export class PDFGenerator {
  /**
   * Download PDF dengan komponen Document yang diberikan
   */
  static async downloadPDF(
    data: FormValues, 
    pdfDocumentElement: PDFDocumentElement, 
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

      // Validasi bahwa element adalah Document component
      if (!this.isDocumentElement(pdfDocumentElement)) {
        return {
          success: false,
          error: "Komponen PDF harus berupa Document component dari @react-pdf/renderer"
        };
      }

      // Dynamic import untuk menghindari SSR issues
      const { pdf } = await import('@react-pdf/renderer') as { pdf: ReactPDFComponents['pdf'] };
      
      // Create PDF
      const pdfInstance = pdf(pdfDocumentElement);
      const blob = await pdfInstance.toBlob();
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
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

  /**
   * Cek apakah element adalah Document component
   */
  private static isDocumentElement(element: unknown): element is PDFDocumentElement {
    if (!element || typeof element !== 'object') return false;
    
    // Gunakan tipe yang lebih spesifik
    const reactElement = element as BasicReactElement;
    
    if (!reactElement.type || !reactElement.props) return false;
    
    // Cek jika ini adalah element React yang valid
    const isReactElement = 
      reactElement.$$typeof === Symbol.for('react.element') ||
      (typeof reactElement.type === 'function' || typeof reactElement.type === 'string');
    
    // Cek jika memiliki children yang valid
    const hasValidChildren = 
      Array.isArray(reactElement.props.children) || 
      typeof reactElement.props.children === 'object' ||
      typeof reactElement.props.children === 'string' ||
      typeof reactElement.props.children === 'undefined';
    
    return isReactElement && hasValidChildren;
  }

  /**
   * Helper untuk trigger download dari URL
   */
  static triggerDownload(downloadUrl: string, filename: string): void {
    // Validasi input
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

  /**
   * Method yang menggabungkan generate dan download
   */
  static async generateAndDownloadPDF(
    data: FormValues, 
    pdfDocumentElement: PDFDocumentElement, 
    filename?: string
  ): Promise<DownloadResult> {
    const result = await this.downloadPDF(data, pdfDocumentElement, filename);
    
    if (result.success && result.downloadUrl) {
      const finalFilename = filename || this.generateFilename(data);
      this.triggerDownload(result.downloadUrl, finalFilename);
    }
    
    return result;
  }

  /**
   * Helper untuk membuat PDF Document element
   */
  static async createPDFDocument(
    TemplateComponent: ComponentType<{ data: FormValues }>,
    data: FormValues
  ): Promise<PDFDocumentElement> {
    // Dynamic import Document dan komponen PDF
    const { Document, Page } = await import('@react-pdf/renderer') as { 
      Document: ReactPDFComponents['Document']; 
      Page: ReactPDFComponents['Page'] 
    };
    
    // Buat Template element dengan tipe yang lebih spesifik
    const TemplateElement: ReactElement<{ data: FormValues }> = {
      type: TemplateComponent,
      props: { data },
      key: null,
      $$typeof: Symbol.for('react.element')
    } as ReactElement<{ data: FormValues }>;
    
    // Buat Page element dengan Template sebagai children
    const PageElement: ReactElement = {
      type: Page,
      props: {
        size: "A4" as const,
        style: { padding: 30 },
        children: TemplateElement
      },
      key: null,
      $$typeof: Symbol.for('react.element')
    } as ReactElement;
    
    // Buat Document element
    return {
      type: Document,
      props: {
        children: PageElement
      },
      key: null,
      $$typeof: Symbol.for('react.element')
    } as PDFDocumentElement;
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

  /**
   * Helper untuk mendapatkan label kondisi
   */
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
    // Handle kasus dataPewaris tidak ada
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
    
    // Cek properti dasar
    if (!formData.dataPewaris?.nama) return false;
    if (!formData.kondisi) return false;
    
    // Validasi untuk semua kondisi kecuali kondisi 6
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

  /**
   * Utility untuk membersihkan URL object yang tidak terpakai
   */
  static cleanup(): void {
    // Method untuk manual cleanup jika diperlukan
    // Tidak ada implementasi spesifik karena URL.revokeObjectURL sudah dipanggil otomatis
  }
}