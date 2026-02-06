// app/dashboard/user/status/page.tsx - Tambahkan bagian untuk menangani error
"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function StatusPage() {
  const searchParams = useSearchParams();
  const errorMessage = useMemo(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error === "no-access" && message) {
      return decodeURIComponent(message);
    }
    if (error === "system-error") {
      return "Terjadi kesalahan sistem. Silakan coba lagi nanti.";
    }
    return null;
  }, [searchParams]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Tampilkan error jika ada */}
      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Akses Ditolak</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {/* Progress steps dan komponen status lainnya tetap sama */}
      {/* ... existing code ... */}
    </div>
  );
}
