// app/dashboard/admin/submissions/[id]/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  FileText,
  Home,
  Phone,
  Mail,
  Shield,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface AhliWaris {
  hubungan: string;
  masihHidup: boolean;
  nama: string;
  namaAyah: string | null;
  tempatLahir: string;
  tanggalLahir: string;
  nik: string | null;
  pekerjaan: string | null;
  agama: string | null;
  alamat: string | null;
}

interface DocumentLog {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  } | null;
}

interface SubmissionDetail {
  id: string;
  nomorSurat: string;
  kondisi: string;
  
  // Data utama dari schema
  namaPewaris: string;
  namaAyahPewaris: string;
  tempatLahirPewaris: string;
  tanggalLahirPewaris: string;
  alamatPewaris: string;
  rtPewaris: string | null;
  rwPewaris: string | null;
  kelurahanPewaris: string;
  kecamatanPewaris: string;
  kotaPewaris: string;
  agamaPewaris: string | null;
  pekerjaanPewaris: string | null;
  
  // Data meninggal
  tempatMeninggal: string | null;
  tanggalMeninggal: string | null;
  noAkteKematian: string | null;
  tanggalAkteKematian: string | null;
  instansiAkteKematian: string | null;
  
  // Data pernikahan
  statusPernikahan: string;
  noSuratNikah: string | null;
  tanggalNikah: string | null;
  instansiNikah: string | null;
  
  // Ahli waris
  ahliWaris: AhliWaris[];
  jumlahAnak: number;
  jumlahIstri: number;
  jumlahSaudara: number;
  jumlahCucu: number;
  
  // Status dan metadata
  status: string;
  catatan: string | null;
  isGenerated: boolean;
  downloadCount: number;
  pdfFileName: string | null;
  pdfFileSize: number | null;
  pdfLastGenerated: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  tanggalSurat: string;
  
  // Relations
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  permohonan: {
    id: string;
    statusPermohonan: string;
    namaPemohon: string;
    email: string;
  } | null;
  documentLogs: DocumentLog[];
  
  // Untuk kompatibilitas
  dataPewaris: {
    nama: string;
    namaAyah: string | null;
    tempatLahir: string;
    tanggalLahir: string;
    tempatMeninggal: string;
    tanggalMeninggal: string;
    alamat: string;
    nomorAkteKematian: string | null;
    jenisKelamin: string;
  };
  tambahanKeterangan: string;
  reviewNotes: string | null;
  pdfUrl: string | null;
}

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-48" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

function SubmissionDetailContent() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubmissionDetail();
  }, [params.id]);

  const fetchSubmissionDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/submissions/${params.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubmission(data.data);
      } else {
        throw new Error(data.error || 'Gagal mengambil data');
      }
    } catch (error) {
      console.error("Failed to fetch submission detail:", error);
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm("Apakah Anda yakin ingin menyetujui surat pernyataan ini?")) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        `/api/admin/submissions/${params.id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes: "" })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Surat pernyataan berhasil disetujui");
        fetchSubmissionDetail();
      } else {
        alert("Gagal menyetujui: " + data.error);
      }
    } catch (error) {
      console.error("Approve error:", error);
      alert("Terjadi kesalahan saat menyetujui surat pernyataan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (!reason) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `/api/admin/submissions/${params.id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Surat pernyataan berhasil ditolak");
        fetchSubmissionDetail();
      } else {
        alert("Gagal menolak: " + data.error);
      }
    } catch (error) {
      console.error("Reject error:", error);
      alert("Terjadi kesalahan saat menolak surat pernyataan");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: id });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800 border border-gray-200",
      SUBMITTED: "bg-blue-50 text-blue-700 border border-blue-200",
      VERIFIED: "bg-purple-50 text-purple-700 border border-purple-200",
      APPROVED: "bg-green-50 text-green-700 border border-green-200",
      REJECTED: "bg-red-50 text-red-700 border border-red-200",
      ARCHIVED: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    };

    const labels: Record<string, string> = {
      DRAFT: "Draft",
      SUBMITTED: "Submitted",
      VERIFIED: "Verified",
      APPROVED: "Disetujui",
      REJECTED: "Ditolak",
      ARCHIVED: "Arsip",
    };

    return (
      <Badge className={`${colors[status] || ""} font-medium px-3 py-1`}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !submission) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/dashboard/admin/submissions")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Surat pernyataan tidak ditemukan"}
          </AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/dashboard/admin/submissions")}>
          Kembali ke Daftar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/dashboard/admin/submissions")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar
          </Button>

          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detail Surat Pernyataan
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-600">
                  Nomor: {submission.nomorSurat}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {formatDate(submission.tanggalSurat)}
                </span>
              </div>
            </div>
            {getStatusBadge(submission.status)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {submission.status === "SUBMITTED" && (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={actionLoading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {actionLoading ? "Memproses..." : "Setujui"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={actionLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Tolak
              </Button>
            </>
          )}

          {submission.pdfUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(submission.pdfUrl!, "_blank")}
            >
              <Download className="w-4 h-4 mr-2" />
              Lihat PDF
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="detail" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="pewaris">Pewaris</TabsTrigger>
          <TabsTrigger value="ahli-waris">Ahli Waris</TabsTrigger>
          <TabsTrigger value="logs">Riwayat</TabsTrigger>
        </TabsList>

        {/* Tab 1: Detail */}
        <TabsContent value="detail" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informasi Surat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Nomor Surat</p>
                    <p className="font-medium font-mono">{submission.nomorSurat}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Surat</p>
                    <p className="font-medium">{formatDate(submission.tanggalSurat)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(submission.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kondisi</p>
                    <p className="font-medium">{submission.kondisi}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informasi Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Nama</p>
                    <p className="font-medium">
                      {submission.user.name || "Tidak ada nama"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{submission.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    <p className="font-medium">{submission.user.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                    <p className="font-medium">
                      {formatDateTime(submission.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {submission.catatan && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Catatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-800 whitespace-pre-wrap">
                  {submission.catatan}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Data Pewaris */}
        <TabsContent value="pewaris" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Pewaris</CardTitle>
              <CardDescription>
                Informasi lengkap tentang almarhum/almarhumah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Identitas Pewaris
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Nama Lengkap</p>
                      <p className="font-medium">{submission.namaPewaris}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nama Ayah</p>
                      <p className="font-medium">{submission.namaAyahPewaris}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tempat/Tanggal Lahir</p>
                      <p className="font-medium">
                        {submission.tempatLahirPewaris},{" "}
                        {formatDate(submission.tanggalLahirPewaris)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Agama</p>
                      <p className="font-medium">{submission.agamaPewaris || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pekerjaan</p>
                      <p className="font-medium">{submission.pekerjaanPewaris || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Alamat Pewaris
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Alamat</p>
                      <p className="font-medium">{submission.alamatPewaris}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">RT/RW</p>
                        <p className="font-medium">
                          {submission.rtPewaris || "-"}/{submission.rwPewaris || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Kelurahan</p>
                        <p className="font-medium">{submission.kelurahanPewaris}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kecamatan</p>
                      <p className="font-medium">{submission.kecamatanPewaris}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kota</p>
                      <p className="font-medium">{submission.kotaPewaris}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Data Meninggal Dunia
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tempat Meninggal</p>
                      <p className="font-medium">{submission.tempatMeninggal || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Meninggal</p>
                      <p className="font-medium">
                        {submission.tanggalMeninggal ? formatDate(submission.tanggalMeninggal) : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Akta Kematian
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Nomor Akta</p>
                      <p className="font-medium">{submission.noAkteKematian || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Akta</p>
                      <p className="font-medium">
                        {submission.tanggalAkteKematian ? formatDate(submission.tanggalAkteKematian) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Instansi Penerbit</p>
                      <p className="font-medium">{submission.instansiAkteKematian || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Ahli Waris */}
        <TabsContent value="ahli-waris" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Ahli Waris</CardTitle>
              <CardDescription>
                Daftar ahli waris dan informasi terkait
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-600">Jumlah Anak</p>
                    <p className="text-2xl font-bold text-blue-700">{submission.jumlahAnak}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-gray-600">Jumlah Istri</p>
                    <p className="text-2xl font-bold text-green-700">{submission.jumlahIstri}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-sm text-gray-600">Jumlah Saudara</p>
                    <p className="text-2xl font-bold text-yellow-700">{submission.jumlahSaudara}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600">Jumlah Cucu</p>
                    <p className="text-2xl font-bold text-purple-700">{submission.jumlahCucu}</p>
                  </div>
                </div>

                {submission.ahliWaris && submission.ahliWaris.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Daftar Ahli Waris</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {submission.ahliWaris.map((ahli, index) => (
                        <Card key={index} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {ahli.hubungan === "ISTRI"
                                    ? "Istri"
                                    : ahli.hubungan === "SUAMI"
                                    ? "Suami"
                                    : ahli.hubungan === "ANAK"
                                    ? `Anak ${index + 1}`
                                    : ahli.hubungan === "SAUDARA"
                                    ? "Saudara Kandung"
                                    : ahli.hubungan}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`mt-1 ${
                                    ahli.masihHidup
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {ahli.masihHidup ? "Masih Hidup" : "Almarhum"}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="text-gray-500">Nama</p>
                                <p className="font-medium">{ahli.nama}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Nama Ayah</p>
                                <p className="font-medium">{ahli.namaAyah || "-"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Tempat/Tgl Lahir</p>
                                <p className="font-medium">
                                  {ahli.tempatLahir}, {formatDate(ahli.tanggalLahir)}
                                </p>
                              </div>
                              {ahli.nik && (
                                <div>
                                  <p className="text-gray-500">NIK</p>
                                  <p className="font-medium">{ahli.nik}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada data ahli waris</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Riwayat */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Aktivitas</CardTitle>
              <CardDescription>
                Log aktivitas dan perubahan status surat pernyataan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submission.documentLogs && submission.documentLogs.length > 0 ? (
                <div className="space-y-4">
                  {submission.documentLogs.map((log) => (
                    <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(log.createdAt)}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      )}
                      {log.user && (
                        <p className="text-xs text-gray-500 mt-2">
                          Oleh: {log.user.name} ({log.user.email})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Belum ada riwayat aktivitas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Wrapper dengan Suspense untuk menghandle params Promise
export default function SubmissionDetailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SubmissionDetailContent />
    </Suspense>
  );
}