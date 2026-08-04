// app/dashboard/admin/users/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Eye,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/users/StatusBadge";
import { type UserSummary, type UsersApiResponse } from "@/types/admin-users";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      if (appliedSearch.trim()) params.set("search", appliedSearch.trim());

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data: UsersApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          (data as { error?: string }).error || "Gagal memuat daftar pengguna",
        );
      }

      setUsers(data.data);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setAppliedSearch(search.trim());
    setCurrentPage(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
          <Users className="h-7 w-7 text-blue-600" />
          Daftar Pengguna
        </h1>
        <p className="mt-2 text-gray-600">
          Memantau aktivitas pengguna dan surat yang mereka buat
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={fetchUsers}
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari nama atau email pengguna..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Cari
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nama Pengguna</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[90px] text-center">
                Total Surat
              </TableHead>
              <TableHead className="w-[130px]">Status Terbaru</TableHead>
              <TableHead className="w-[150px]">Tanggal Daftar</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="text-gray-600">Memuat daftar pengguna...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users className="h-12 w-12 text-gray-300" />
                    <p className="text-gray-500 font-medium">
                      Tidak ada pengguna ditemukan
                    </p>
                    <p className="text-sm text-gray-400">
                      {search.trim()
                        ? "Coba ubah kata kunci pencarian"
                        : "Belum ada pengguna terdaftar"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <p className="font-medium text-gray-900">
                      {user.name || "Tanpa Nama"}
                    </p>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <p className="flex items-center gap-2">
                      {user.email}
                      {user.totalLetters === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                          belum buat surat
                        </span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-semibold text-blue-700">
                      <FileText className="h-3.5 w-3.5" />
                      {user.totalLetters}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.latestStatus ? (
                      <StatusBadge status={user.latestStatus} />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        router.push(`/dashboard/admin/users/${user.id}`)
                      }
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {users.length > 0 && totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t bg-gray-50 px-6 py-4 sm:flex-row">
            <div className="text-sm text-gray-700">
              Menampilkan{" "}
              <span className="font-semibold">
                {startItem}-{endItem}
              </span>{" "}
              dari <span className="font-semibold">{total}</span> pengguna
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <span className="text-sm text-gray-700">
                Halaman {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || loading}
                className="h-8"
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
