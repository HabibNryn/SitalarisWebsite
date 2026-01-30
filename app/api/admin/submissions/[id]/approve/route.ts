// app/api/admin/submissions/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'
import { generatePDF } from '@/app/lib/pdf'

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
    const body = await request.json().catch(() => ({}))
    const notes = body.notes || ''
    
    // Prepare data for update
    const updateData: any = {
      status: 'APPROVED',
      reviewedAt: new Date(),
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
        details: `Status berubah dari ${submission.status} menjadi APPROVED. ${notes ? `Catatan: ${notes}` : 'Tidak ada catatan'}`,
        metadata: {
          oldStatus: submission.status,
          newStatus: 'APPROVED',
          reviewerId: session.user.id,
          reviewerName: session.user.name || '',
          notes: notes || null,
          kondisi: submission.kondisi,
          nomorSurat: submission.nomorSurat
        }
      }
    })
    
    // Update related permohonan if exists (PERBAIKI: gunakan relasi yang benar)
    if (submission.permohonan) {
      try {
        await prisma.permohonanAhliWaris.update({
          where: { id: submission.permohonan.id },
          data: {
            statusPermohonan: 'COMPLETED',
            updatedAt: new Date()
          }
        })
        console.log('Updated related permohonan:', submission.permohonan.id)
      } catch (permohonanError) {
        console.warn('Failed to update related permohonan:', permohonanError)
        // Tidak throw error, karena update surat sudah berhasil
      }
    }
    
    // Generate PDF jika diperlukan (opsional)
    try {
      // Panggil service generate PDF di sini
      const htmlContent = `<h1>Surat Pernyataan</h1><p>ID: ${submissionId}</p>`
      const fileName = `surat-pernyataan-${submissionId}.pdf`
      await generatePDF(htmlContent, fileName)
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError)
      // Jangan gagalkan proses hanya karena PDF gagal
    }
    
    return NextResponse.json({
      success: true,
      data: updatedSubmission,
      message: 'Surat pernyataan berhasil disetujui'
    })
    
  } catch (error) {
    console.error('Approve error details:', error)
    
    // Handle Prisma errors
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as any
      
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { 
            error: 'Gagal menyetujui surat pernyataan',
            details: 'Data terkait tidak ditemukan',
            suggestion: 'Periksa relasi permohonan ahli waris'
          },
          { status: 404 }
        )
      }
      
      if (prismaError.code === 'P2002') {
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
        stack: process.env.NODE_ENV === 'development' ? (error as any)?.stack : undefined
      },
      { status: 500 }
    )
  }
}