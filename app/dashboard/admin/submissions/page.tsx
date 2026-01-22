// app/dashboard/admin/submissions/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import  Input from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface Submission {
  id: string
  nomorSurat: string
  user: {
    id: string
    name: string
    email: string
  }
  status: string
  createdAt: string
  reviewedAt: string | null
  pdfUrl: string | null
  pdfGenerated: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdminSubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  
  useEffect(() => {
    fetchSubmissions()
  }, [pagination.page, statusFilter])
  
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(search && { search })
      })
      
      const response = await fetch(`/api/admin/submissions?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setSubmissions(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleApprove = async (submissionId: string) => {
    if (!confirm('Apakah Anda yakin ingin menyetujui surat pernyataan ini?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Surat pernyataan berhasil disetujui dan PDF telah dikirim ke email pengguna')
        fetchSubmissions()
      } else {
        alert('Gagal menyetujui surat pernyataan: ' + data.error)
      }
    } catch (error) {
      console.error('Approve error:', error)
      alert('Terjadi kesalahan saat menyetujui surat pernyataan')
    }
  }
  
  const handleReject = async (submissionId: string) => {
    const reason = prompt('Masukkan alasan penolakan:')
    if (!reason) return
    
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Surat pernyataan berhasil ditolak')
        fetchSubmissions()
      } else {
        alert('Gagal menolak surat pernyataan: ' + data.error)
      }
    } catch (error) {
      console.error('Reject error:', error)
      alert('Terjadi kesalahan saat menolak surat pernyataan')
    }
  }
  
  const handleViewDetails = (submissionId: string) => {
    router.push(`/dashboard/admin/submissions/${submissionId}`)
  }
  
  const handleViewPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank')
  }
  
  const handleDownloadPDF = (pdfUrl: string, nomorSurat: string) => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `surat-pernyataan-${nomorSurat}.pdf`
    link.click()
  }
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success'> = {
      'PENDING': 'secondary',
      'UNDER_REVIEW': 'default',
      'APPROVED': 'success',
      'REJECTED': 'destructive',
      'COMPLETED': 'outline'
    }
    
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={colors[status] || ''}>
        {status === 'PENDING' ? 'Menunggu' : 
         status === 'UNDER_REVIEW' ? 'Dalam Review' :
         status === 'APPROVED' ? 'Disetujui' :
         status === 'REJECTED' ? 'Ditolak' :
         status === 'COMPLETED' ? 'Selesai' : status}
      </Badge>
    )
  }
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: id })
    } catch {
      return dateString
    }
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Surat Pernyataan</h1>
        <p className="text-gray-600 mt-2">
          Review dan kelola semua pengajuan surat pernyataan ahli waris
        </p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Cari nomor surat atau nama pengguna..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchSubmissions()}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="UNDER_REVIEW">Dalam Review</SelectItem>
                <SelectItem value="APPROVED">Disetujui</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={fetchSubmissions}>
            <Filter className="w-4 h-4 mr-2" />
            Terapkan Filter
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Surat</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableHead>Tanggal Review</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Tidak ada data surat pernyataan
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {submission.nomorSurat}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.user.name || 'Tidak ada nama'}</p>
                      <p className="text-sm text-gray-500">{submission.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(submission.status)}
                  </TableCell>
                  <TableCell>
                    {formatDate(submission.createdAt)}
                  </TableCell>
                  <TableCell>
                    {submission.reviewedAt ? formatDate(submission.reviewedAt) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(submission.id)}
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {submission.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(submission.id)}
                            title="Setujui"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(submission.id)}
                            title="Tolak"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {submission.pdfUrl && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPDF(submission.pdfUrl!)}
                            title="Lihat PDF"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPDF(submission.pdfUrl!, submission.nomorSurat)}
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(submission.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          {submission.pdfUrl && (
                            <>
                              <DropdownMenuItem onClick={() => handleViewPDF(submission.pdfUrl!)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Lihat PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadPDF(submission.pdfUrl!, submission.nomorSurat)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(submission.nomorSurat)}>
                            Salin Nomor Surat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {submissions.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-700">
              Menampilkan {((pagination.page - 1) * pagination.limit) + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}