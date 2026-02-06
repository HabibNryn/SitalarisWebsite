"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SubmissionActionsProps = {
  submissionId: string;
  status: string;
};

export default function SubmissionActions({
  submissionId,
  status,
}: SubmissionActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm("Apakah Anda yakin ingin menyetujui surat pernyataan ini?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/submissions/${submissionId}/approve`,
        { method: "POST" },
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menyetujui surat pernyataan");
      }

      alert("Surat pernyataan berhasil disetujui");
      router.push("/dashboard/admin/submissions");
      router.refresh();
    } catch (error) {
      console.error("Approve error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyetujui surat pernyataan",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (!reason) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/submissions/${submissionId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        },
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menolak surat pernyataan");
      }

      alert("Surat pernyataan berhasil ditolak");
      router.push("/dashboard/admin/submissions");
      router.refresh();
    } catch (error) {
      console.error("Reject error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menolak surat pernyataan",
      );
    } finally {
      setLoading(false);
    }
  };

  if (status !== "PENDING") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={loading}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Setujui & Kirim Email
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleReject}
            disabled={loading}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Tolak Pengajuan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
