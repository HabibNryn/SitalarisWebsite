// components/admin/users/LetterTable.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Mail,
  Send,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "./StatusBadge";
import { type LetterItem } from "@/types/admin-users";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Semua Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "VERIFIED", label: "Verified" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "REJECTED", label: "Ditolak" },
  { value: "COMPLETED", label: "Selesai" },
  { value: "SENT", label: "Terkirim" },
];

interface LetterTableProps {
  userId: string;
}

export default function LetterTable({ userId }: LetterTableProps) {
  const [letters, setLetters] = useState<LetterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // State untuk proses kirim email
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [dialogMessage, setDialogMessage] = useState("");

  const fetchLetters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const response = await fetch(
        `/api/admin/users/${userId}/letters?${params.toString()}`,
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal memuat surat");
      }

      setLetters(data.data.letters);
    } catch (err) {
      console.error("Failed to fetch letters:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [userId, statusFilter]);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  const handleSendEmail = async (letterId: string) => {
    setSendingId(letterId);
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal mengirim email");
      }

      setDialogType("success");
      setDialogMessage(
        `Email berhasil dikirim ke alamat email pengguna. Status surat telah diperbarui menjadi "${data.data?.status || "SENT"}".`,
      );
      setDialogOpen(true);

      // Refresh data agar status terbaru tampil
      fetchLetters();
    } catch (err) {
      console.error("Send email error:", err);
      setDialogType("error");
      setDialogMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim email",
      );
      setDialogOpen(true);
    } finally {
      setSendingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: id });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="w-56">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-gray-500">{letters.length} surat</span>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={fetchLetters}
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Judul Surat</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[170px]">Tanggal Dibuat</TableHead>
              <TableHead className="w-[200px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-500">
                      Memuat data surat...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : letters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-3 text-gray-500">
                    Tidak ada surat ditemukan
                  </p>
                  <p className="text-sm text-gray-400">
                    {statusFilter !== "ALL"
                      ? "Coba ubah filter status"
                      : "Pengguna belum memiliki surat"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              letters.map((letter) => (
                <TableRow key={letter.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {letter.nomorSurat}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={letter.status} />
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(letter.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        title="Lihat Detail"
                      >
                        <Link
                          href={`/dashboard/admin/submissions/${letter.id}`}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      {letter.status === "COMPLETED" && (
                        <Button
                          size="sm"
                          className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleSendEmail(letter.id)}
                          disabled={sendingId === letter.id}
                          title="Kirim Email notifikasi selesai"
                        >
                          {sendingId === letter.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Kirim Email
                        </Button>
                      )}

                      {letter.status === "SENT" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-teal-700"
                          disabled
                          title={`Email terkirim ${letter.sentAt ? formatDate(letter.sentAt) : ""}`}
                        >
                          <Mail className="h-4 w-4" />
                          Terkirim
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Notifikasi dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={
                dialogType === "success"
                  ? "flex items-center gap-2 text-emerald-600"
                  : "flex items-center gap-2 text-red-600"
              }
            >
              {dialogType === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              {dialogType === "success"
                ? "Email Terkirim"
                : "Gagal Mengirim Email"}
            </AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialogOpen(false)}>
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
