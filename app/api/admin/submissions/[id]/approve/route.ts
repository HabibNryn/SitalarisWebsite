// app/api/admin/submissions/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'
import { generatePDF } from '@/app/lib/pdf'
import { Prisma } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
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
    
    const { id: submissionId } = await params
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
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
            email: true
          }
        },
        permohonan: {
          select: {
            id: true,
            statusPermohonan: true
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
    
    console.log('Submission data:', {
      id: submission.id,
      kondisi: submission.kondisi,
      permohonanId: submission.permohonan?.id,
      status: submission.status
    })
    
    // Check if already approved/rejected
    if (submission.status === 'APPROVED') {
      return NextResponse.json(
        { error: 'Surat sudah disetujui sebelumnya' },
        { status: 400 }
      )
    }
    
    if (submission.status === 'REJECTED') {
      return NextResponse.json(
        { error: 'Surat sudah ditolak sebelumnya' },
        { status: 400 }
      )
    }
    
    // Get request body for notes
    const body = (await request.json().catch(() => ({}))) as {
      notes?: string
    }
    const notes = typeof body.notes === 'string' ? body.notes : ''
    
    // ========== PERUBAHAN DI SINI ==========
    // Prepare data for update - TAMBAHKAN can_access_permohonan: true
    const updateData: Prisma.SuratPernyataanUpdateInput = {
      status: 'APPROVED',
      reviewedAt: new Date(),
      can_access_permohonan: true, // <-- INI YANG DITAMBAHKAN
    }
    
    // Add notes only if provided
    if (notes.trim()) {
      updateData.catatan = notes
    }
    
    // Update submission
    const updatedSubmission = await prisma.suratPernyataan.update({
      where: { id: submissionId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true, // <-- Tambahkan ini untuk notifikasi
            name: true,
            email: true
          }
        },
        permohonan: {
          select: {
            id: true,
            statusPermohonan: true,
            namaPemohon: true
          }
        }
      }
    })
    
    // Create document log
    await prisma.documentLog.create({
      data: {
        suratPernyataanId: submissionId,
        userId: session.user.id,
        action: 'STATUS_CHANGE',
        details: `Status berubah dari ${submission.status} menjadi APPROVED. User mendapatkan akses untuk mengisi form permohonan. ${notes ? `Catatan: ${notes}` : 'Tidak ada catatan'}`,
        metadata: {
          oldStatus: submission.status,
          newStatus: 'APPROVED',
          reviewerId: session.user.id,
          reviewerName: session.user.name || '',
          notes: notes || null,
          kondisi: submission.kondisi,
          nomorSurat: submission.nomorSurat,
          can_access_permohonan: true, // <-- Tambahkan ke log
          granted_at: new Date().toISOString()
        }
      }
    })
    
    // NOTE:
    // Jangan mengubah status permohonan di tahap persetujuan surat pernyataan.
    // Setelah disetujui, user baru mendapatkan akses untuk mengisi form permohonan.
    
    // ========== NOTIFIKASI KE USER ==========
    // Anda bisa tambahkan notifikasi di sini
    try {
      // Contoh: Kirim notifikasi ke user
      await prisma.notification.create({
        data: {
          userId: updatedSubmission.user.id,
          title: 'Surat Pernyataan Disetujui',
          message: `Surat pernyataan Anda telah disetujui oleh admin. Anda sekarang dapat mengisi form surat permohonan ahli waris.`,
          isRead: false,
          metadata: {
            suratPernyataanId: submissionId,
            action: 'ACCESS_GRANTED',
            next_step_url: '/dashboard/SuratPermohonan'
          }
        }
      })
      
      // Anda juga bisa kirim email di sini jika diperlukan
      console.log(`Access granted for user ${updatedSubmission.user.id} to fill permohonan form`)
      
    } catch (notificationError) {
      console.warn('Failed to send notification:', notificationError)
      // Jangan gagalkan proses karena notifikasi gagal
    }
    
    // Generate PDF jika diperlukan (opsional)
    try {
      const htmlContent = `<h1>Surat Pernyataan Disetujui</h1>
                          <p>ID: ${submissionId}</p>
                          <p>Status: APPROVED</p>
                          <p>Waktu: ${new Date().toLocaleString('id-ID')}</p>
                          <p>Disetujui oleh: ${session.user.name || 'Admin'}</p>`
      const fileName = `surat-pernyataan-approved-${submissionId}.pdf`
      await generatePDF(htmlContent, fileName)
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError)
      // Jangan gagalkan proses hanya karena PDF gagal
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...updatedSubmission,
        can_access_permohonan: true // <-- Pastikan ini ada di response
      },
      message: 'Surat pernyataan berhasil disetujui. User sekarang dapat mengisi form permohonan.'
    })
    
  } catch (error) {
    console.error('Approve error details:', error)
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { 
            error: 'Gagal menyetujui surat pernyataan',
            details: 'Data terkait tidak ditemukan',
            suggestion: 'Periksa relasi permohonan ahli waris'
          },
          { status: 404 }
        )
      }
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { 
            error: 'Gagal menyetujui surat pernyataan',
            details: 'Konflik data',
            suggestion: 'Data sudah dimodifikasi oleh pengguna lain'
          },
          { status: 409 }
        )
      }
    }
    
    // Handle unknown errors
    return NextResponse.json(
      { 
        error: 'Gagal menyetujui surat pernyataan',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
