// app/api/admin/submissions/[id]/reject/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { sendRejectionEmail } from '@/lib/email'

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
    
    const { reason } = await request.json()
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
    
    // Update submission
    const updatedSubmission = await prisma.suratPernyataan.update({
      where: { id: submissionId },
      data: {
        status: 'REJECTED',
        reviewNotes: reason,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      }
    })
    
    // Send rejection email
    try {
      await sendRejectionEmail(
        submission.user.email!,
        submission.user.name || 'Pengguna',
        submission.nomorSurat,
        reason
      )
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError)
    }
    
    return NextResponse.json({
      success: true,
      data: updatedSubmission,
      message: 'Submission rejected'
    })
    
  } catch (error) {
    console.error('Reject error:', error)
    return NextResponse.json(
      { error: 'Failed to reject submission' },
      { status: 500 }
    )
  }
}