// app/dashboard/user/status/StatusClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function StatusClient() {
  const searchParams = useSearchParams();
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [rejectionDate, setRejectionDate] = useState<string | null>(null);
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

  useEffect(() => {
    let isMounted = true;

    const fetchAccessStatus = async () => {
      try {
        const response = await fetch("/api/user/check-permohonan-access");
        const data = await response.json();

        if (!response.ok) return;

        if (data.status === "REJECTED") {
          if (isMounted) {
            setRejectionMessage(data.message || "Surat pernyataan Anda ditolak.");
            setRejectionDate(data.lastSubmission?.reviewedAt || null);
          }
        }
      } catch {
        // No-op: status page should remain usable even if this request fails
      }
    };

    fetchAccessStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      {rejectionMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Surat Pernyataan Ditolak</AlertTitle>
          <AlertDescription>
            <div>{rejectionMessage}</div>
            {rejectionDate && (
              <div className="mt-2 text-sm">
                Ditolak pada {new Date(rejectionDate).toLocaleString("id-ID")}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
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
