// app/api/user/check-permohonan-access/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth/auth-options';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          hasAccess: false, 
          message: 'Unauthorized' 
        },
        { status: 401 }
      );
    }
    
    // Cek apakah user adalah admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });
    
    if (user?.isAdmin) {
      return NextResponse.json({
        hasAccess: true,
        message: 'Admin memiliki akses penuh',
        isAdmin: true
      });
    }
    
    // Cek apakah user memiliki surat pernyataan yang sudah disetujui
    const suratPernyataan = await prisma.suratPernyataan.findFirst({
      where: {
        userId: session.user.id,
        status: 'APPROVED'
      },
      select: {
        id: true,
        reviewedAt: true,
        reviewedBy: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!suratPernyataan) {
      // Cek status terakhir
      const lastSubmission = await prisma.suratPernyataan.findFirst({
        where: {
          userId: session.user.id
        },
        select: {
          status: true,
          createdAt: true,
          reviewNotes: true,
          reviewedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      let status = 'NO_SUBMISSION';
      let message = 'Anda belum mengajukan surat pernyataan';
      
      if (lastSubmission) {
        if (lastSubmission.status === 'SUBMITTED') {
          status = 'PENDING';
          message = 'Surat pernyataan Anda masih dalam proses verifikasi';
        } else if (lastSubmission.status === 'REJECTED') {
          status = 'REJECTED';
          message = `Surat pernyataan Anda ditolak${lastSubmission.reviewNotes ? `. Alasan: ${lastSubmission.reviewNotes}` : ''}`;
        } else if (lastSubmission.status === 'APPROVED') {
          status = 'APPROVED_NO_ACCESS';
          message = 'Surat Anda disetujui tetapi belum mendapatkan akses ke form permohonan';
        }
      }
      
      return NextResponse.json({
        hasAccess: false,
        status: status,
        message: message,
        lastSubmission: lastSubmission
      });
    }
    
    return NextResponse.json({
      hasAccess: true,
      status: 'APPROVED_WITH_ACCESS',
      message: 'Anda memiliki akses untuk mengisi form permohonan',
      data: {
        suratId: suratPernyataan.id,
        approvedAt: suratPernyataan.reviewedAt,
        approvedBy: suratPernyataan.reviewedBy || 'Admin'
      }
    });
    
  } catch (error) {
    console.error('Check permohonan access error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        hasAccess: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
