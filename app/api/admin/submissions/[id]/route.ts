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
    
    // Parse ahliWaris jika berupa string JSON
    let ahliWarisData = submission.ahliWaris
    if (typeof submission.ahliWaris === 'string') {
      try {
        ahliWarisData = JSON.parse(submission.ahliWaris as string)
      } catch {
        ahliWarisData = []
      }
    }
    
    // Format response sesuai dengan schema
    const formattedSubmission = {
      id: submission.id,
      nomorSurat: submission.nomorSurat,
      kondisi: submission.kondisi,
      
      // Data pewaris (dari field schema)
      namaPewaris: submission.namaPewaris,
      namaAyahPewaris: submission.namaAyahPewaris,
      tempatLahirPewaris: submission.tempatLahirPewaris,
      tanggalLahirPewaris: submission.tanggalLahirPewaris,
      alamatPewaris: submission.alamatPewaris,
      rtPewaris: submission.rtPewaris,
      rwPewaris: submission.rwPewaris,
      kelurahanPewaris: submission.kelurahanPewaris,
      kecamatanPewaris: submission.kecamatanPewaris,
      kotaPewaris: submission.kotaPewaris,
      agamaPewaris: submission.agamaPewaris,
      pekerjaanPewaris: submission.pekerjaanPewaris,
      
      // Data meninggal
      tempatMeninggal: submission.tempatMeninggal,
      tanggalMeninggal: submission.tanggalMeninggal,
      noAkteKematian: submission.noAkteKematian,
      tanggalAkteKematian: submission.tanggalAkteKematian,
      instansiAkteKematian: submission.instansiAkteKematian,
      
      // Data pernikahan
      statusPernikahan: submission.statusPernikahan,
      noSuratNikah: submission.noSuratNikah,
      tanggalNikah: submission.tanggalNikah,
      instansiNikah: submission.instansiNikah,
      
      // Ahli waris (dari field Json)
      ahliWaris: ahliWarisData,
      jumlahAnak: submission.jumlahAnak,
      jumlahIstri: submission.jumlahIstri,
      jumlahSaudara: submission.jumlahSaudara,
      jumlahCucu: submission.jumlahCucu,
      
      // Status dan metadata
      status: submission.status,
      catatan: submission.catatan,
      isGenerated: submission.isGenerated,
      downloadCount: submission.downloadCount,
      pdfFileName: submission.pdfFileName,
      pdfFileSize: submission.pdfFileSize,
      pdfLastGenerated: submission.pdfLastGenerated,
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString(),
      reviewedAt: submission.reviewedAt?.toISOString() || null,
      tanggalSurat: submission.tanggalSurat.toISOString(),
      
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
      dataPewaris: {
        nama: submission.namaPewaris,
        namaAyah: submission.namaAyahPewaris,
        tempatLahir: submission.tempatLahirPewaris,
        tanggalLahir: submission.tanggalLahirPewaris.toISOString(),
        tempatMeninggal: submission.tempatMeninggal || '',
        tanggalMeninggal: submission.tanggalMeninggal?.toISOString() || '',
        alamat: submission.alamatPewaris,
        nomorAkteKematian: submission.noAkteKematian,
        jenisKelamin: 'LAKI-LAKI' // Default karena tidak ada field di schema
      },
      tambahanKeterangan: submission.kondisi, // Gunakan kondisi sebagai tambahan keterangan
      reviewNotes: submission.catatan, // Gunakan catatan sebagai reviewNotes
      pdfUrl: submission.isGenerated ? `/api/submissions/${submission.id}/download` : null
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