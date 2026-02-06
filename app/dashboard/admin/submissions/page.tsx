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
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  catatan?: string
  isGenerated?: boolean
  downloadCount?: number
  dataPewaris?: Record<string, unknown>
  ahliWaris?: Array<Record<string, unknown>>
}


export default function AdminSubmissionsPage() {
  const router = useRouter()
  
  // State untuk data submissions
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State untuk filter dan search
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  
  // State untuk pagination (terpisah dari object pagination)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [previewingId, setPreviewingId] = useState<string | null>(null)
  
  // Debug: log untuk memastikan submission.id valid
  useEffect(() => {
    console.log('Submissions data:', submissions.map(s => ({ id: s.id, nomorSurat: s.nomorSurat })))
  }, [submissions])
  
  // Fetch data dengan dependency yang jelas
  useEffect(() => {
    fetchSubmissions()
  }, [currentPage, statusFilter])
  
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(search && { search })
      })
      
      console.log('Fetching from URL:', `/api/admin/submissions?${params}`)
      
      const response = await fetch(`/api/admin/submissions?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        console.log('API Response data:', data.data)
        setSubmissions(data.data)
        setTotalItems(data.pagination.total)
        setTotalPages(data.pagination.pages)
      } else {
        throw new Error(data.error || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleApprove = async (submissionId: string) => {
    if (!submissionId) {
      alert('ID surat tidak valid')
      return
    }
    
    if (!confirm('Apakah Anda yakin ingin menyetujui surat pernyataan ini?')) {
      return
    }
    
    try {
      console.log('Approving submission with ID:', submissionId)
      const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Surat pernyataan berhasil disetujui')
        fetchSubmissions() // Refresh data
      } else {
        alert('Gagal menyetujui surat pernyataan: ' + data.error)
      }
    } catch (error) {
      console.error('Approve error:', error)
      alert('Terjadi kesalahan saat menyetujui surat pernyataan')
    }
  }
  
  const handleReject = async (submissionId: string) => {
    if (!submissionId) {
      alert('ID surat tidak valid')
      return
    }
    
    const reason = prompt('Masukkan alasan penolakan:')
    if (!reason) return
    
    try {
      console.log('Rejecting submission with ID:', submissionId)
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
        fetchSubmissions() // Refresh data
      } else {
        alert('Gagal menolak surat pernyataan: ' + data.error)
      }
    } catch (error) {
      console.error('Reject error:', error)
      alert('Terjadi kesalahan saat menolak surat pernyataan')
    }
  }
  
  const handleViewDetails = (submissionId: string) => {
    if (!submissionId) {
      alert('ID surat tidak valid')
      return
    }
    
    console.log('Navigating to detail page with ID:', submissionId)
    router.push(`/dashboard/admin/submissions/${submissionId}`)
  }
  
  const handleViewPDF = (pdfUrl: string) => {
    if (!pdfUrl) {
      alert('URL PDF tidak valid')
      return
    }
    window.open(pdfUrl, '_blank')
  }
  
  // Fungsi untuk download PDF menggunakan API yang sudah ada
  const handleDownloadPDF = async (submissionId: string, nomorSurat: string) => {
    if (!submissionId) {
      alert('ID surat tidak valid')
      return
    }
    
    setDownloadingId(submissionId)
    
    try {
      // Fetch data submission terlebih dahulu
      console.log("Downoading Submissions:", submissionId)
      const submissionResponse = await fetch(`/api/admin/submissions/${submissionId}`)
      const submissionData = await submissionResponse.json()
      console.log('Submission data for PDF download:', submissionData)
      
      if (!submissionData.success) {
        throw new Error('Gagal mengambil data submission')
      }
      
      const submission = submissionData.data
      console.log('Submission rawData:', submission)

          console.log('Found submission with data:', {
      hasDataPewaris: !!submission.dataPewaris,
      hasAhliWaris: !!submission.ahliWaris,
      ahliWarisCount: submission.ahliWaris?.length || 0
    });
      
      // Format data untuk PDF
      if (!submission?.dataPewaris) {
        throw new Error('Data pewaris tidak ditemukan')
      }

      const pdfData = {
        dataPewaris: submission.data?.dataPewaris || submission.dataPewaris,
        ahliWaris: submission.da || submission.ahliWaris,
        kondisi: submission.data?.kondisi || submission.kondisi || "kondisi1",
        tambahanKeterangan: submission.data?.tambahanKeterangan || submission.tambahanKeterangan || '',
        

        anakMeninggal: submission.data?.anakMeninggal || submission.anakMeninggal || []
      }

      console.log('PDF Data to send:', pdfData)
      console.log('Data Types:', {
        dataPewaris : typeof pdfData.dataPewaris,
        ahliWaris : typeof pdfData.ahliWaris,
        kondisi : typeof pdfData.kondisi,
        tambahanKeterangan : typeof pdfData.tambahanKeterangan
      })

          // Validasi data
    if (!pdfData.dataPewaris || !pdfData.ahliWaris) {
      console.error('Missing required data:', {
        hasDataPewaris: !!pdfData.dataPewaris,
        hasAhliWaris: !!pdfData.ahliWaris
      })
      throw new Error('Data tidak lengkap untuk membuat PDF')
    }
      
      // Generate filename
      const pewarisNama = submission.dataPewaris?.nama || 'tanpa-nama'
      const filename = `surat-pernyataan-${nomorSurat}-${pewarisNama}.pdf`
      
      // Call PDF generation API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gagal menghasilkan PDF`)
      }
      
      // Create blob and download
      const blob = await response.blob()
      console.log('PDF Blob received:', blob)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.download = filename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
      
      console.log('PDF download berhasil')
      
      // Update download count jika perlu
      await fetch(`/api/admin/submissions/${submissionId}/increment-download`, { method: 'POST' })
      
    } catch (error) {
      console.error('Download error:', error)
      alert(`Gagal mengunduh PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDownloadingId(null)
    }
  }
  
  // Fungsi untuk preview PDF
  const handlePreviewPDF = async (submissionId: string) => {
    if (!submissionId) {
      alert('ID surat tidak valid')
      return
    }
    
    setPreviewingId(submissionId)
    
    try {
      // Fetch data submission
      const submissionResponse = await fetch(`/api/admin/submissions/${submissionId}`)
      const submissionData = await submissionResponse.json()
      
      if (!submissionData.success) {
        throw new Error('Gagal mengambil data submission')
      }
      
      const submission = submissionData.data
      
      // Format data untuk PDF
      if (!submission?.dataPewaris) {
        throw new Error('Data pewaris tidak ditemukan')
      }

      const pdfData = {
        dataPewaris: submission.dataPewaris,
        ahliWaris: submission.ahliWaris,
        kondisi: submission.kondisi,
        tambahanKeterangan: submission.tambahanKeterangan || ''
      }
      
      // Call PDF generation API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gagal menghasilkan PDF`)
      }
      
      // Create blob and open in new tab
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      
    } catch (error) {
      console.error('Preview error:', error)
      alert(`Gagal membuka preview: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setPreviewingId(null)
    }
  }
  
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800 border border-gray-200',
      'SUBMITTED': 'bg-blue-50 text-blue-700 border border-blue-200',
      'VERIFIED': 'bg-purple-50 text-purple-700 border border-purple-200',
      'APPROVED': 'bg-green-50 text-green-700 border border-green-200',
      'REJECTED': 'bg-red-50 text-red-700 border border-red-200',
      'ARCHIVED': 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    }
    
    const labels: Record<string, string> = {
      'DRAFT': 'Draft',
      'SUBMITTED': 'Submitted',
      'VERIFIED': 'Verified',
      'APPROVED': 'Disetujui',
      'REJECTED': 'Ditolak',
      'ARCHIVED': 'Arsip'
    }
    
    return (
      <Badge className={`${colors[status] || 'bg-gray-100 text-gray-800'} font-medium px-3 py-1`}>
        {labels[status] || status}
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
  
  const handleSearchSubmit = () => {
    setCurrentPage(1) // Reset ke halaman pertama saat search
    fetchSubmissions()
  }
  
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1) // Reset ke halaman pertama saat filter berubah
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Hitung range data yang ditampilkan
  const startItem = totalItems > 0 ? ((currentPage - 1) * pageSize) + 1 : 0
  const endItem = Math.min(currentPage * pageSize, totalItems)
  
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Surat Pernyataan</h1>
        <p className="text-gray-600 mt-2">
          Review dan kelola semua pengajuan surat pernyataan ahli waris
        </p>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4"
            onClick={() => fetchSubmissions()}
          >
            Coba Lagi
          </Button>
        </Alert>
      )}
      
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="APPROVED">Disetujui</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
                <SelectItem value="ARCHIVED">Arsip</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearchSubmit} disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            {loading ? 'Memuat...' : 'Terapkan Filter'}
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">No. Surat</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[180px]">Tanggal Pengajuan</TableHead>
              <TableHead className="w-[180px]">Tanggal Review</TableHead>
              <TableHead className="w-[200px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
                    <p className="text-gray-600">Memuat data surat pernyataan...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Search className="w-12 h-12 text-gray-300" />
                    <div>
                      <p className="text-gray-500 font-medium">Tidak ada data ditemukan</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {search || statusFilter !== 'ALL' 
                          ? 'Coba ubah filter atau kata kunci pencarian' 
                          : 'Belum ada surat pernyataan yang diajukan'}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono font-medium text-gray-900">
                    {submission.nomorSurat}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {submission.user?.name || 'Tidak ada nama'}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {submission.user?.email || 'Tidak ada email'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(submission.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-gray-900">{formatDate(submission.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {submission.reviewedAt ? (
                      <div className="flex flex-col">
                        <span className="text-gray-900">{formatDate(submission.reviewedAt)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('View details clicked for ID:', submission.id)
                          handleViewDetails(submission.id)
                        }}
                        title="Lihat Detail"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {submission.status === 'SUBMITTED' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                            onClick={() => {
                              console.log('Approve clicked for ID:', submission.id)
                              handleApprove(submission.id)
                            }}
                            title="Setujui"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              console.log('Reject clicked for ID:', submission.id)
                              handleReject(submission.id)
                            }}
                            title="Tolak"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                                      {/* Tombol Preview PDF */}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePreviewPDF(submission.id)}
                  title="Preview PDF"
                  disabled={previewingId === submission.id}
                >
                  {previewingId === submission.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </Button>
                      
                  {/* Tombol Download PDF */}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDownloadPDF(submission.id, submission.nomorSurat)}
                  title="Download PDF"
                  disabled={downloadingId === submission.id}
                >
                  {downloadingId === submission.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(submission.nomorSurat)}>
                            Salin Nomor Surat
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            navigator.clipboard.writeText(submission.id)
                            console.log('Copied ID:', submission.id)
                          }}>
                            Salin ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem
                            onClick={() => handlePreviewPDF(submission.id)}
                            disabled={previewingId === submission.id}
                            className="cursor-pointer"
                          >
                            {previewingId === submission.id ? 'Membuka Preview...' : 'Preview PDF'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadPDF(submission.id, submission.nomorSurat)}
                            disabled={downloadingId === submission.id}
                            className="cursor-pointer"
                          >
                            {downloadingId === submission.id ? 'Mengunduh...' : 'Download PDF'}
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
        {submissions.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-gray-50">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Menampilkan <span className="font-semibold">{startItem}-{endItem}</span> dari{' '}
              <span className="font-semibold">{totalItems}</span> data
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="h-8"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </Button>
              
              <div className="flex items-center space-x-1">
                {/* Generate page buttons */}
                {(() => {
                  const pages = []
                  const maxVisiblePages = 5
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
                  
                  // Adjust start page if we're near the end
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1)
                  }
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        disabled={loading}
                        className="h-8 w-8 min-w-0 p-0"
                      >
                        {i}
                      </Button>
                    )
                  }
                  
                  return pages
                })()}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
                className="h-8"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
