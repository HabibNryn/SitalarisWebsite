// /components/DownloadPDFButton.tsx
"use client";

import { useState, lazy, Suspense, ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FormValues } from "@/app/dashboard/SuratPernyataan/types";
import { usePDFDownload, PDFTemplateComponentType } from "@/hooks/hooks/usePDFDownload";

interface DownloadPDFButtonProps {
  data: FormValues;
  fileName?: string;
  templateType?: string; // 'default' | 'kondisi1' | 'kondisi2' | etc.
}

export default function DownloadPDFButton({ 
  data, 
  fileName,
  templateType = 'default'
}: DownloadPDFButtonProps) {
  const { 
    downloadPDF,
    downloadPDFWithTemplate,
    isDownloading, 
    error,
    generateFilename 
  } = usePDFDownload();
  
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!data) {
      setLocalError("Data belum siap");
      return;
    }

    try {
      const finalFilename = fileName || generateFilename(data);
      let success: boolean;

      if (templateType === 'default') {
        // Gunakan template default - perlu mendefinisikan template default
        const DefaultTemplate = lazy(() => import('@/app/components/surat-templates/SuratPernyataanKondisi1'));
        
        success = await downloadPDFWithTemplate(
          data,
          DefaultTemplate as PDFTemplateComponentType,
          finalFilename
        );
      } else {
        // Gunakan template khusus berdasarkan kondisi
        const templateMap: Record<string, ComponentType<{ data: FormValues }>> = {
          'kondisi1': lazy(() => import('@/app/components/surat-templates/SuratPernyataanKondisi1')),
          // 'kondisi2': lazy(() => import('@/app/components/surat-templates/SuratPernyataanKondisi2')),
          // ... tambahkan template lainnya
        };

        const LazyTemplate = templateMap[templateType];
        
        if (!LazyTemplate) {
          throw new Error(`Template untuk ${templateType} tidak ditemukan`);
        }

        success = await downloadPDFWithTemplate(
          data,
          LazyTemplate as PDFTemplateComponentType,
          finalFilename
        );
      }
      
      if (!success) {
        setLocalError("Gagal mendownload PDF");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      setLocalError(errorMessage);
      console.error("Download error:", err);
    }
  };

  const displayError = error || localError;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-2">
        <Button
          onClick={handleDownload}
          disabled={isDownloading || !data}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? "Membuat PDF..." : "Download PDF"}
        </Button>
        
        {displayError && (
          <p className="text-sm text-red-600">{displayError}</p>
        )}
      </div>
    </Suspense>
  );
}