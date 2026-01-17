import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, FileText, Loader2 } from 'lucide-react';
import { FormValues } from '../types';
import { downloadPDF, openPDFInNewTab } from '../services/pdfService';

interface DownloadPDFButtonProps {
  data: FormValues;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  fileName?: string;
}

export default function DownloadPDFButton({
  data,
  disabled = false,
  onSuccess,
  onError
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Fungsi validasi data - PERBAIKAN DI SINI
  const validateDataForPDF = (data: FormValues): boolean => {
    // Gunakan data.dataPewaris BUKAN data.pewaris
    if (!data.dataPewaris?.nama) return false;
    if (!data.dataPewaris?.tempatLahir) return false;
    if (!data.dataPewaris?.tanggalLahir) return false;
    if (!data.dataPewaris?.alamat) return false;
    
    // Validasi minimal satu ahli waris (kecuali kondisi 6 - tidak ada ahli waris)
    if (data.kondisi !== "kondisi6" && (!data.ahliWaris || data.ahliWaris.length === 0)) {
      return false;
    }
    
    return true;
  };

  const handleDownload = async () => {
    if (!data || disabled) return;
    
    // Validasi sebelum download
    if (!validateDataForPDF(data)) {
      onError?.(new Error("Data tidak lengkap. Silakan lengkapi semua field yang diperlukan."));
      return;
    }
    
    setIsLoading(true);
    try {
      const filename = `surat-pernyataan-ahli-waris-${data.dataPewaris.nama || 'document'}-${Date.now()}.pdf`;
      await downloadPDF(data, filename);
      onSuccess?.();
    } catch (error) {
      console.error('Download failed:', error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!data || disabled) return;
    
    // Validasi sebelum preview
    if (!validateDataForPDF(data)) {
      onError?.(new Error("Data tidak lengkap. Silakan lengkapi semua field yang diperlukan sebelum preview."));
      return;
    }
    
    setIsPrinting(true);
    try {
      await openPDFInNewTab(data);
    } catch (error) {
      console.error('Preview failed:', error);
      onError?.(error as Error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleGenerateAndSave = async () => {
    if (!data || disabled) return;
    
    // Validasi sebelum save & download
    if (!validateDataForPDF(data)) {
      onError?.(new Error("Data tidak lengkap. Silakan lengkapi semua field yang diperlukan."));
      return;
    }
    
    setIsLoading(true);
    try {
      // Save to database first
      const saveResponse = await fetch('/api/surat-pernyataan/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        throw new Error(`Failed to save data: ${errorText}`);
      }

      const savedData = await saveResponse.json();
      
      // Then download PDF
      const filename = `surat-pernyataan-${savedData.documentId || Date.now()}.pdf`;
      await downloadPDF(data, filename);
      
      onSuccess?.();
    } catch (error) {
      console.error('Save and download failed:', error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleDownload}
        disabled={disabled || isLoading || !validateDataForPDF(data)}
        className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        title={!validateDataForPDF(data) ? "Data tidak lengkap. Silakan lengkapi semua field." : ""}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        Download PDF
      </Button>
      
      <Button
        onClick={handlePreview}
        disabled={disabled || isPrinting || !validateDataForPDF(data)}
        variant="outline"
        className="border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        title={!validateDataForPDF(data) ? "Data tidak lengkap. Silakan lengkapi semua field." : ""}
      >
        {isPrinting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <FileText className="w-4 h-4 mr-2" />
        )}
        Preview
      </Button>
      
      <Button
        onClick={handleGenerateAndSave}
        disabled={disabled || isLoading || !validateDataForPDF(data)}
        variant="outline"
        className="border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
        title={!validateDataForPDF(data) ? "Data tidak lengkap. Silakan lengkapi semua field." : ""}
      >
        <Printer className="w-4 h-4 mr-2" />
        Save & Download
      </Button>
    </div>
  );
}