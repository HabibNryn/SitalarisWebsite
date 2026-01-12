"use client";

import { useState } from "react";
import SuratPernyataanPDF from "./SuratPernyataanPDF";

interface DownloadPDFButtonProps {
  data: any;
  fileName?: string;
}

export default function DownloadPDFButton({
  data,
  fileName = "surat-pernyataan-ahli-waris.pdf",
}: DownloadPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!data) {
      alert("Data belum siap");
      return;
    }

    try {
      setLoading(true);

      // 🔥 WAJIB dynamic import
      const { pdf } = await import("@react-pdf/renderer");

      const blob = await pdf(
        <SuratPernyataanPDF data={data} />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal download PDF:", error);
      alert("Gagal membuat PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Membuat PDF..." : "Download PDF"}
    </button>
  );
}
