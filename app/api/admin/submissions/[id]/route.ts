// app/api/admin/submissions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params adalah Promise
) {
  try {
    // UNWRAP params dengan await
    const { id: submissionId } = await params
    
    if (!submissionId) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }
    
    const session = await getServerSession(authOptions)
    
    // Check if user exists in session
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true, role: true }
    })
    
    if (!user?.isAdmin && user?.role !== 'admin' && user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    // Get submission with related data
    const submission = await prisma.suratPernyataan.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        permohonan: {
          select: {
            id: true,
            statusPermohonan: true,
            namaPemohon: true,
            email: true
          }
        },
        documentLogs: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Surat pernyataan tidak ditemukan' },
        { status: 404 }
      )
    }
    
    const parseJsonField = <T>(value: unknown, fallback: T): T => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value) as T
        } catch {
          return fallback
        }
      }
      if (value == null) return fallback
      return value as T
    }

    // Parse JSON fields (handle stringified JSON)
    const ahliWarisData = parseJsonField<unknown[]>(submission.ahliWaris, [])
    const dataPewarisData = parseJsonField<Record<string, unknown>>(
      submission.dataPewaris,
      {}
    )
    const anakMeninggalData = parseJsonField<unknown[] | null>(
      submission.anakMeninggal,
      null
    )
    
    // Format response sesuai dengan schema
    const formattedSubmission = {
      id: submission.id,
      nomorSurat: submission.nomorSurat,
      kondisi: submission.kondisi,
      
      // JSON fields
      dataPewaris: dataPewarisData,
      ahliWaris: ahliWarisData,
      anakMeninggal: anakMeninggalData,
      tambahanKeterangan: submission.tambahanKeterangan || '',
      noSuratNikahKedua: submission.noSuratNikahKedua,
      tanggalNikahKedua: submission.tanggalNikahKedua?.toISOString() || null,
      instansiNikahKedua: submission.instansiNikahKedua,
      
      // Status dan metadata
      status: submission.status,
      reviewNotes: submission.reviewNotes,
      isGenerated: submission.isGenerated,
      downloadCount: submission.downloadCount,
      pdfFileName: submission.pdfFileName,
      pdfFileSize: submission.pdfFileSize,
      pdfUrl: submission.pdfUrl,
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString(),
      reviewedAt: submission.reviewedAt?.toISOString() || null,
      tanggalSurat: submission.createdAt.toISOString(),
      
      // Relations
      user: submission.user,
      permohonan: submission.permohonan,
      documentLogs: submission.documentLogs.map(log => ({
        id: log.id,
        action: log.action,
        details: log.details,
        createdAt: log.createdAt.toISOString(),
        user: log.user
      })),
      
      // Tambahan untuk kompatibilitas dengan frontend yang ada
      dataPewarisCompat: {
        nama: String(dataPewarisData.nama ?? ''),
        namaAyah: String(dataPewarisData.namaAyah ?? ''),
        tempatLahir: String(dataPewarisData.tempatLahir ?? ''),
        tanggalLahir: String(dataPewarisData.tanggalLahir ?? ''),
        tempatMeninggal: String(dataPewarisData.tempatMeninggal ?? ''),
        tanggalMeninggal: String(dataPewarisData.tanggalMeninggal ?? ''),
        alamat: String(dataPewarisData.alamat ?? ''),
        nomorAkteKematian: String(dataPewarisData.nomorAkteKematian ?? ''),
        jenisKelamin: String(dataPewarisData.jenisKelamin ?? 'LAKI-LAKI')
      },
      catatan: submission.reviewNotes || submission.tambahanKeterangan || '',
      pdfDownloadUrl: submission.pdfUrl
    }
    
    return NextResponse.json({
      success: true,
      data: formattedSubmission,
      message: 'Detail surat pernyataan berhasil diambil'
    })
    
  } catch (error) {
    console.error('Get submission detail error:', error)
    return NextResponse.json(
      { 
        error: 'Gagal mengambil detail surat pernyataan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
