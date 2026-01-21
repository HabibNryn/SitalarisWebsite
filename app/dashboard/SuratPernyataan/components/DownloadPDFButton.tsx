import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, FileText, Loader2 } from 'lucide-react';
import { FormValues } from '../types';
import { downloadPDF, openPDFInNewTab } from '../services/pdfService';

interface DownloadPDFButtonProps {
  data: FormValues;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function DownloadPDFButton({
  data,
  disabled = false,
  onSuccess,
  onError
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const isValid = useMemo(() => {
    if (!data?.dataPewaris?.nama) return false;
    if (!data.dataPewaris.tempatLahir) return false;
    if (!data.dataPewaris.tanggalLahir) return false;
    if (!data.dataPewaris.alamat) return false;

    if (data.kondisi !== 'kondisi6' && (!data.ahliWaris || data.ahliWaris.length === 0)) {
      return false;
    }

    return true;
  }, [data]);

  const handleDownload = async () => {
    if (!isValid || disabled) return;

    setIsLoading(true);
    try {
      const filename = `surat-pernyataan-${data.dataPewaris.nama}-${Date.now()}.pdf`;
      await downloadPDF(data, filename);
      onSuccess?.();
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!isValid || disabled) return;

    setIsPrinting(true);
    try {
      await openPDFInNewTab(data);
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button onClick={handleDownload} disabled={!isValid || isLoading}>
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
        Download
      </Button>

      <Button variant="outline" onClick={handlePreview} disabled={!isValid || isPrinting}>
        {isPrinting ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2" />}
        Preview
      </Button>
    </div>
  );
}
