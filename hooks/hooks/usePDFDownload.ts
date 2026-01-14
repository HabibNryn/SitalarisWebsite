// /hooks/usePDFDownload.ts
import { useState, useCallback, ComponentType, useRef } from 'react';
import { FormValues } from "@/app/dashboard/SuratPernyataan/types";
import { PDFGenerator } from "@/app/lib/pdf/PDFGenerator";

export type PDFTemplateComponentType = ComponentType<{ data: FormValues }>;

export function usePDFDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  
  // Gunakan ref untuk menghindari stale closures
  const isMounted = useRef(true);

  // Cleanup on unmount
  useState(() => {
    return () => {
      isMounted.current = false;
    };
  });

  const downloadPDF = useCallback(async (
    data: FormValues,
    TemplateComponent: PDFTemplateComponentType,
    filename?: string
  ) => {
    // Reset state
    setIsDownloading(true);
    setError(null);
    setProgress(10);
    
    try {
      // Update progress - tidak terlalu sering untuk menghindari re-render
      const progressInterval = setInterval(() => {
        if (isMounted.current) {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }
      }, 300);

      // Generate PDF dengan timeout
      const result = await PDFGenerator.generateAndDownload(
        data,
        TemplateComponent,
        filename
      );

      clearInterval(progressInterval);
      
      if (isMounted.current) {
        setProgress(100);
      }

      if (!result.success) {
        throw new Error(result.error || 'Gagal mendownload PDF');
      }

      // Delay kecil untuk memberikan feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mendownload PDF';
      
      if (isMounted.current) {
        setError(errorMessage);
        setProgress(0);
      }
      
      console.error('PDF download error:', err);
      return false;
    } finally {
      if (isMounted.current) {
        setIsDownloading(false);
        
        // Reset progress setelah beberapa saat
        setTimeout(() => {
          if (isMounted.current) {
            setProgress(0);
          }
        }, 1000);
      }
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    downloadPDF,
    isDownloading,
    error,
    progress,
    generateFilename: useCallback((data: FormValues) => PDFGenerator.generateFilename(data), []),
    resetError
  };
}