// app/api/surat-pernyataan/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { FormValues } from '@/app/dashboard/SuratPernyataan/types'

// Helper function untuk parse tanggal dengan aman
function parseDateSafely(dateString?: string): Date | null {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const data: FormValues = await request.json()
    
    // Validasi data wajib
    if (!data.dataPewaris?.nama) {
      return NextResponse.json(
        { error: 'Nama pewaris harus diisi' },
        { status: 400 }
      )
    }
    
    if (!data.dataPewaris?.tanggalLahir) {
      return NextResponse.json(
        { error: 'Tanggal lahir pewaris harus diisi' },
        { status: 400 }
      )
    }
    
    if (!data.dataPewaris?.tanggalMeninggal) {
      return NextResponse.json(
        { error: 'Tanggal meninggal pewaris harus diisi' },
        { status: 400 }
      )
    }
    
    // Generate nomor surat
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    const nomorSurat = `SP-${year}${month}${day}-${random}`
    
    // Parse tanggal dengan aman
    const tanggalLahirPewaris = parseDateSafely(data.dataPewaris.tanggalLahir)
    const tanggalMeninggalPewaris = parseDateSafely(data.dataPewaris.tanggalMeninggal)
    const tanggalAkteKematian = parseDateSafely(data.dataPewaris.tanggalAkteKematian)
    const tanggalNikah = parseDateSafely(data.dataPewaris.tanggalNikah)
    
    if (!tanggalLahirPewaris || !tanggalMeninggalPewaris) {
      return NextResponse.json(
        { error: 'Format tanggal tidak valid' },
        { status: 400 }
      )
    }
    
    // Hitung jumlah ahli waris
    const ahliWaris = data.ahliWaris || []
    const jumlahIstri = ahliWaris.filter(item => item.hubungan === 'ISTRI').length
    const jumlahAnak = ahliWaris.filter(item => item.hubungan === 'ANAK').length
    const jumlahSaudara = ahliWaris.filter(item => item.hubungan === 'SAUDARA').length
    const jumlahCucu = ahliWaris.filter(item => item.hubungan === 'CUCU').length
    
    // Siapkan data untuk Prisma dengan tipe yang benar
    const suratPernyataanData = {
      nomorSurat,
      userId: session.user.id,
      kondisi: data.kondisi,
      
      // Data Pewaris - wajib
      namaPewaris: data.dataPewaris.nama,
      namaAyahPewaris: data.dataPewaris.namaAyah || '',
      tempatLahirPewaris: data.dataPewaris.tempatLahir || '',
      tanggalLahirPewaris: tanggalLahirPewaris,
      alamatPewaris: data.dataPewaris.alamat || '',
      
      // Data Meninggal - wajib
      tempatMeninggal: data.dataPewaris.tempatMeninggal || '',
      tanggalMeninggal: tanggalMeninggalPewaris,
      
      // Data tambahan - opsional
      rtPewaris: data.dataPewaris.rtPewaris,
      rwPewaris: data.dataPewaris.rwPewaris,
      
      // Data Kematian - opsional
      noAkteKematian: data.dataPewaris.nomorAkteKematian,
      tanggalAkteKematian: tanggalAkteKematian,
      
      // Data Pernikahan - opsional
      statusPernikahan: data.dataPewaris.statusPernikahan || 'MENIKAH_1',
      noSuratNikah: data.dataPewaris.noSuratNikah,
      tanggalNikah: tanggalNikah,
      instansiNikah: data.dataPewaris.instansiNikah,
      
      // Data Ahli Waris
      ahliWaris: data.ahliWaris || [],
      
      // Jumlah untuk statistik
      jumlahIstri,
      jumlahAnak,
      jumlahSaudara,
      jumlahCucu,
      
      // Status - default ke DRAFT jika ada masalah
      status: 'SUBMITTED' as const, // Gunakan const assertion untuk tipe literal
      
      catatan: data.tambahanKeterangan,
    }
    
    console.log('Creating surat pernyataan with data:', {
      ...suratPernyataanData,
      ahliWaris: 'Data ahli waris ada'
    })
    
    // Save to database
    const submission = await prisma.suratPernyataan.create({
      data: suratPernyataanData,
      include: {
        user: {
          select: {
            name: true,
            email: true 
          }
        }
      }
    })
    
    // Log action
    await prisma.documentLog.create({
      data: {
        suratPernyataanId: submission.id,
        userId: session.user.id,
        action: 'CREATE',
        details: `Surat pernyataan dibuat dengan nomor ${nomorSurat}`,
      }
    })
    
    return NextResponse.json({
      success: true,
      data: submission,
      message: 'Surat pernyataan berhasil diajukan'
    })
    
  } catch (error: any) {
    console.error('Submit error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Cek jika error Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Nomor surat sudah ada. Silakan coba lagi.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: `Failed to submit surat pernyataan: ${error.message}` },
      { status: 500 }
    )
  }
}