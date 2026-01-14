// /components/DownloadPDFButton.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FormValues } from "@/app/dashboard/SuratPernyataan/types";
import { usePDFDownload } from "@/hooks/hooks/usePDFDownload";
import { Progress } from "@/components/ui/progress";
import SuratPernyataanKondisi1 from "@/app/components/surat-templates/SuratPernyataanKondisi1";

interface DownloadPDFButtonProps {
  data: FormValues;
  fileName?: string;
}

export default function DownloadPDFButton({ 
  data, 
  fileName
}: DownloadPDFButtonProps) {
  const { 
    downloadPDF,
    isDownloading, 
    error,
    progress,
    generateFilename 
  } = usePDFDownload();
  
  const [localError, setLocalError] = useState<string | null>(null);
  const isProcessing = useRef(false);

  const handleDownload = async () => {
    // Cegah multiple clicks
    if (isProcessing.current || !data) {
      if (!data) {
        setLocalError("Data belum siap");
      }
      return;
    }

    try {
      isProcessing.current = true;
      setLocalError(null);

      const finalFilename = fileName || generateFilename(data);
      
      // Gunakan template berdasarkan kondisi data
      const TemplateComponent = SuratPernyataanKondisi1;
      
      const success = await downloadPDF(
        data, 
        TemplateComponent, 
        finalFilename
      );
      
      if (!success && !error) {
        setLocalError("Gagal mendownload PDF");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      setLocalError(errorMessage);
      console.error("Download error:", err);
    } finally {
      isProcessing.current = false;
    }
  };

  const displayError = error || localError;

  return (
    <div className="space-y-3 w-full max-w-md">
      <Button
        onClick={handleDownload}
        disabled={isDownloading || !data}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full transition-all duration-200"
        aria-label={isDownloading ? "Membuat PDF..." : "Download PDF"}
      >
        {isDownloading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Membuat PDF... {progress}%</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </>
        )}
      </Button>
      
      {isDownloading && progress > 0 && (
        <Progress value={progress} className="h-2 transition-all duration-300" />
      )}
      
      {displayError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md animate-in fade-in duration-300">
          <p className="text-sm text-red-600 font-medium">Error:</p>
          <p className="text-sm text-red-600 mt-1">{displayError}</p>
          <button
            onClick={() => setLocalError(null)}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Tutup
          </button>
        </div>
      )}
      
      {!isDownloading && !displayError && (
        <p className="text-xs text-gray-500 text-center">
          Klik tombol di atas untuk mengunduh PDF
        </p>
      )}
    </div>
  );
}