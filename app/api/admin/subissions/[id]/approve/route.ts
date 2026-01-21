// app/api/admin/submissions/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { storageService } from '@/lib/storage'
import { sendApprovalEmail } from '@/lib/email'
import { generateSuratPernyataanPDF } from '@/lib/pdf-generator'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const submissionId = params.id
    
    // Get submission with user data
    const submission = await prisma.suratPernyataan.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }
    
    // Generate PDF
    const pdfData = {
      kondisi: submission.kondisi,
      dataPewaris: submission.dataPewaris as any,
      ahliWaris: submission.ahliWaris as any,
      tambahanKeterangan: submission.tambahanKeterangan || ''
    }
    
    const pdfBuffer = await generateSuratPernyataanPDF(pdfData, submission.nomorSurat)
    
    // Upload PDF to storage
    const fileName = `surat-pernyataan-${submissionId}-${Date.now()}.pdf`
    const pdfUrl = await storageService.uploadFile(fileName, Buffer.from(pdfBuffer))
    
    // Update submission
    const updatedSubmission = await prisma.suratPernyataan.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        pdfUrl,
        pdfGenerated: true,
        pdfGeneratedAt: new Date(),
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      }
    })
    
    // Send email to user
    try {
      await sendApprovalEmail(
        submission.user.email!,
        submission.user.name || 'Pengguna',
        submission.nomorSurat,
        Buffer.from(pdfBuffer)
      )
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Continue even if email fails
    }
    
    return NextResponse.json({
      success: true,
      data: updatedSubmission,
      message: 'Submission approved and PDF sent to user'
    })
    
  } catch (error) {
    console.error('Approve error:', error)
    return NextResponse.json(
      { error: 'Failed to approve submission' },
      { status: 500 }
    )
  }
}