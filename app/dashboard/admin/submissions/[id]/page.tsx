// app/dashboard/admin/submissions/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth/auth-options';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  User,
  Calendar,
  MapPin,
  Home,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  // Unwrap params yang berupa Promise
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return notFound();
  }
  
  // Ambil data submission dari database
  const submission = await prisma.suratPernyataan.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      documentLogs: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  
  if (!submission) {
    return notFound();
  }
  
  // Parse data JSON jika perlu
  const dataPewaris = typeof submission.dataPewaris === 'string' 
    ? JSON.parse(submission.dataPewaris) 
    : submission.dataPewaris;
  
  const ahliWaris = typeof submission.ahliWaris === 'string'
    ? JSON.parse(submission.ahliWaris)
    : submission.ahliWaris;

  type AhliWarisItem = {
    nama?: string;
    hubungan?: string;
    statusHidup?: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    pekerjaan?: string;
    nik?: string;
    keterangan?: string;
  };

  const ahliWarisList: AhliWarisItem[] = Array.isArray(ahliWaris)
    ? (ahliWaris as AhliWarisItem[])
    : [];
  
  // Helper untuk badge status
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'SUBMITTED': 'bg-blue-50 text-blue-700',
      'VERIFIED': 'bg-purple-50 text-purple-700',
      'APPROVED': 'bg-green-50 text-green-700',
      'REJECTED': 'bg-red-50 text-red-700',
    };
    
    const labels: Record<string, string> = {
      'DRAFT': 'Draft',
      'SUBMITTED': 'Submitted',
      'VERIFIED': 'Verified',
      'APPROVED': 'Disetujui',
      'REJECTED': 'Ditolak',
    };
    
    return (
      <Badge className={`${colors[status] || 'bg-gray-100'} px-3 py-1 font-medium`}>
        {labels[status] || status}
      </Badge>
    );
  };
  
  // Format tanggal
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header dengan tombol kembali */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detail Surat Pernyataan
            </h1>
            <p className="text-gray-600 mt-2">
              Nomor: <span className="font-mono font-semibold">{submission.nomorSurat}</span>
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/submissions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom kiri: Informasi utama */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Status dan Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Status dan Informasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(submission.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kondisi</p>
                  <p className="mt-1 font-medium">{submission.kondisi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                  <p className="mt-1 font-medium">{formatDate(submission.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Review</p>
                  <p className="mt-1 font-medium">{formatDate(submission.reviewedAt)}</p>
                </div>
              </div>
              
              {submission.catatan && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Catatan:
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">{submission.catatan}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Card: Data Pewaris */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Pewaris
              </CardTitle>
              <CardDescription>
                Informasi lengkap tentang almarhum/almahrum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="mt-1 font-medium">{dataPewaris.nama || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama Ayah</p>
                  <p className="mt-1 font-medium">{dataPewaris.namaAyah || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tempat/Tanggal Lahir</p>
                  <p className="mt-1 font-medium">
                    {dataPewaris.tempatLahir || '-'}, {dataPewaris.tanggalLahir 
                      ? formatDate(dataPewaris.tanggalLahir) 
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Meninggal</p>
                  <p className="mt-1 font-medium">
                    {dataPewaris.tanggalMeninggal 
                      ? formatDate(dataPewaris.tanggalMeninggal) 
                      : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="mt-1 font-medium">{dataPewaris.alamat || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Agama</p>
                  <p className="mt-1 font-medium">{dataPewaris.agama || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pekerjaan</p>
                  <p className="mt-1 font-medium">{dataPewaris.pekerjaan || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card: Ahli Waris */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Daftar Ahli Waris
              </CardTitle>
              <CardDescription>
                {ahliWaris.length} orang ahli waris
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ahliWarisList.map((ahli, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {ahli.nama || 'Tidak diketahui'}
                          <Badge variant="outline">{ahli.hubungan}</Badge>
                          {ahli.statusHidup === 'MENINGGAL' && (
                            <Badge variant="destructive" className="text-xs">
                              Meninggal
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {ahli.tempatLahir || '-'}, {ahli.tanggalLahir 
                            ? formatDate(ahli.tanggalLahir) 
                            : '-'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{ahli.pekerjaan || '-'}</p>
                        <p className="text-xs text-gray-500">NIK: {ahli.nik || '-'}</p>
                      </div>
                    </div>
                    {ahli.keterangan && (
                      <p className="text-sm text-gray-600 mt-2">{ahli.keterangan}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Kolom kanan: Sidebar */}
        <div className="space-y-6">
          {/* Card: Pengguna */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{submission.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{submission.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-sm">{submission.user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card: Aksi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Aksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                asChild
              >
                <Link href={`/api/admin/submissions/${id}/pdf/download`} target="_blank">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Link>
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
                asChild
              >
                <Link href={`/api/admin/submissions/${id}/pdf/preview`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview PDF
                </Link>
              </Button>
              
              {submission.status === 'SUBMITTED' && (
                <>
                  <Button 
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                    onClick={async () => {
                      'use server';
                      // Aksi approve
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Setujui
                  </Button>
                  
                  <Button 
                    className="w-full justify-start bg-red-600 hover:bg-red-700"
                    variant="destructive"
                    onClick={async () => {
                      'use server';
                      // Aksi reject
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Tolak
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Card: Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submission.documentLogs.length > 0 ? (
                  submission.documentLogs.map((log, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{log.details}</p>
                      <p className="text-gray-500 text-xs">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Tidak ada log aktivitas</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
