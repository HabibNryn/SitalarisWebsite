// app/dashboard/admin/submissions/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface SubmissionDetail {
  id: string
  nomorSurat: string
  kondisi: string
  dataPewaris: any
  ahliWaris: any[]
  tambahanKeterangan: string
  status: string
  createdAt: string
  reviewedAt: string | null
  reviewNotes: string | null
  pdfUrl: string | null
  user: {
    id: string
    name: string
    email: string
  }
}

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchSubmissionDetail()
  }, [params.id])
  
  const fetchSubmissionDetail = async () => {
    try {
      const response = await fetch(`/api/admin/submissions/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setSubmission(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch submission detail:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleApprove = async () => {
    if (!confirm('Apakah Anda yakin ingin menyetujui surat pernyataan ini?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/admin/submissions/${params.id}/approve`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Surat pernyataan berhasil disetujui')
        fetchSubmissionDetail()
        router.push('/dashboard/admin/submissions')
      }
    } catch (error) {
      console.error('Approve error:', error)
      alert('Terjadi kesalahan saat menyetujui surat pernyataan')
    }
  }
  
  const handleReject = async () => {
    const reason = prompt('Masukkan alasan penolakan:')
    if (!reason) return
    
    try {
      const response = await fetch(`/api/admin/submissions/${params.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Surat pernyataan berhasil ditolak')
        fetchSubmissionDetail()
        router.push('/dashboard/admin/submissions')
      }
    } catch (error) {
      console.error('Reject error:', error)
      alert('Terjadi kesalahan saat menolak surat pernyataan')
    }
  }
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id })
    } catch {
      return dateString
    }
  }
  
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={`${colors[status] || ''} text-sm`}>
        {status === 'PENDING' ? 'Menunggu Review' :
         status === 'UNDER_REVIEW' ? 'Dalam Review' :
         status === 'APPROVED' ? 'Disetujui' :
         status === 'REJECTED' ? 'Ditolak' : status}
      </Badge>
    )
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!submission) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Data tidak ditemukan</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/dashboard/admin/submissions')}
        >
          Kembali ke Daftar
        </Button>
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/dashboard/admin/submissions')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detail Surat Pernyataan
            </h1>
            <p className="text-gray-600 mt-2">
              Nomor: {submission.nomorSurat}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(submission.status)}
            {submission.pdfUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(submission.pdfUrl!, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Lihat PDF
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Pewaris */}
          <Card>
            <CardHeader>
              <CardTitle>Data Pewaris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="font-medium">{submission.dataPewaris.nama}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nama Ayah</p>
                    <p className="font-medium">{submission.dataPewaris.namaAyah || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tempat/Tanggal Lahir</p>
                    <p className="font-medium">
                      {submission.dataPewaris.tempatLahir}, {formatDate(submission.dataPewaris.tanggalLahir)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tempat/Tanggal Meninggal</p>
                    <p className="font-medium">
                      {submission.dataPewaris.tempatMeninggal}, {formatDate(submission.dataPewaris.tanggalMeninggal)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-medium">{submission.dataPewaris.alamat}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nomor Akta Kematian</p>
                    <p className="font-medium">{submission.dataPewaris.nomorAkteKematian || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jenis Kelamin</p>
                    <p className="font-medium">
                      {submission.dataPewaris.jenisKelamin === 'LAKI-LAKI' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Data Ahli Waris */}
          <Card>
            <CardHeader>
              <CardTitle>Data Ahli Waris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {submission.ahliWaris.map((ahli, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">
                        {ahli.hubungan === 'ISTRI' ? 'Istri' :
                         ahli.hubungan === 'SUAMI' ? 'Suami' :
                         ahli.hubungan === 'ANAK' ? `Anak ${index + 1}` :
                         ahli.hubungan === 'SAUDARA' ? 'Saudara Kandung' : ahli.hubungan}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {ahli.masihHidup ? 'Masih Hidup' : 'Almarhum'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Nama</p>
                        <p className="font-medium">{ahli.nama}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Nama Ayah</p>
                        <p className="font-medium">{ahli.namaAyah || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tempat/Tgl Lahir</p>
                        <p className="font-medium">
                          {ahli.tempatLahir}, {formatDate(ahli.tanggalLahir)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">NIK</p>
                        <p className="font-medium">{ahli.nik || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pekerjaan</p>
                        <p className="font-medium">{ahli.pekerjaan || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Agama</p>
                        <p className="font-medium">{ahli.agama || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Alamat</p>
                        <p className="font-medium">{ahli.alamat || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Keterangan Tambahan */}
          {submission.tambahanKeterangan && (
            <Card>
              <CardHeader>
                <CardTitle>Keterangan Tambahan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {submission.tambahanKeterangan}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Review Notes */}
          {submission.reviewNotes && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Catatan Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 whitespace-pre-wrap">
                  {submission.reviewNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{submission.user.name || 'Tidak ada nama'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{submission.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                  <p className="font-medium">{formatDate(submission.createdAt)}</p>
                </div>
                {submission.reviewedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Review</p>
                    <p className="font-medium">{formatDate(submission.reviewedAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          {submission.status === 'PENDING' && (
            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Setujui & Kirim Email
                  </Button>
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleReject}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak Pengajuan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* PDF Actions */}
          {submission.pdfUrl && (
            <Card>
              <CardHeader>
                <CardTitle>File PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(submission.pdfUrl!, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Lihat PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = submission.pdfUrl!
                      link.download = `surat-pernyataan-${submission.nomorSurat}.pdf`
                      link.click()
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID</span>
                  <span className="font-mono">{submission.id.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kondisi</span>
                  <span>{submission.kondisi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah Ahli Waris</span>
                  <span>{submission.ahliWaris.length} orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PDF Generated</span>
                  <span>{submission.pdfUrl ? 'Ya' : 'Tidak'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}