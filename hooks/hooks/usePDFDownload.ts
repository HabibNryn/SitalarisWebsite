// /hooks/usePDFDownload.ts
import { useState, useCallback, ComponentType } from 'react';
import { FormValues } from "@/app/dashboard/SuratPernyataan/types";
import { PDFGenerator } from "@/app/lib/pdf/PDFGenerator";

// Definisikan tipe di sini jika tidak ada di PDFGenerator
export type PDFTemplateProps = {
  data: FormValues;
};
export type PDFTemplateComponentType = ComponentType<PDFTemplateProps>;

export function usePDFDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Download PDF dengan komponen template khusus
   */
  const downloadPDFWithTemplate = useCallback(async (
    data: FormValues,
    TemplateComponent: PDFTemplateComponentType,
    customFilename?: string
  ) => {
    try {
      setIsDownloading(true);
      setError(null);

      // Buat PDF element dari komponen template
      const pdfElement = await PDFGenerator.createPDFDocument(
        TemplateComponent,
        data
      );

      // Generate dan download PDF
      const result = await PDFGenerator.generateAndDownloadPDF(
        data,
        pdfElement,
        customFilename
      );

      if (!result.success) {
        throw new Error(result.error || 'Gagal mendownload PDF');
      }

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mendownload PDF';
      setError(errorMessage);
      console.error('PDF download error:', err);
      return false;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  /**
   * Download PDF dengan template berdasarkan kondisi
   */
  const downloadPDFByKondisi = useCallback(async (
    data: FormValues,
    getTemplateByKondisi: (kondisi: string) => PDFTemplateComponentType | Promise<PDFTemplateComponentType>,
    customFilename?: string
  ) => {
    try {
      setIsDownloading(true);
      setError(null);

      // Dapatkan komponen template berdasarkan kondisi
      const TemplateComponent = await Promise.resolve(getTemplateByKondisi(data.kondisi));

      if (!TemplateComponent) {
        throw new Error(`Template untuk kondisi ${data.kondisi} tidak ditemukan`);
      }

      // Download dengan template yang sesuai
      return await downloadPDFWithTemplate(data, TemplateComponent, customFilename);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mendownload PDF';
      setError(errorMessage);
      console.error('PDF download error:', err);
      return false;
    } finally {
      setIsDownloading(false);
    }
  }, [downloadPDFWithTemplate]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Format data untuk template PDF
   */
  const formatDataForPDF = useCallback((data: FormValues) => {
    return PDFGenerator.formatDataForPDF(data);
  }, []);

  /**
   * Generate filename untuk PDF
   */
  const generateFilename = useCallback((data: FormValues) => {
    return PDFGenerator.generateFilename(data);
  }, []);

  /**
   * Get label untuk kondisi
   */
  const getKondisiLabel = useCallback((kondisi: string) => {
    return PDFGenerator.getKondisiLabel(kondisi);
  }, []);

  /**
   * Format tanggal ke format Indonesia
   */
  const formatTanggalIndo = useCallback((dateString: string) => {
    return PDFGenerator.formatTanggalIndo(dateString);
  }, []);

  return {
    // Method untuk download
    downloadPDF: downloadPDFWithTemplate,
    downloadPDFWithTemplate,
    downloadPDFByKondisi,
    
    // State
    isDownloading,
    error,
    
    // Helper methods
    resetError,
    formatDataForPDF,
    generateFilename,
    getKondisiLabel,
    formatTanggalIndo
  };
}