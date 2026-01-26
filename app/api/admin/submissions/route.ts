// app/api/admin/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'
import { StatusSurat, Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user exists in session
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is admin (sesuai schema Anda)
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
    
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Build where clause dengan tipe yang benar
    const where: Prisma.SuratPernyataanWhereInput = {}
    
    // Filter by status dengan type casting
    if (statusParam && statusParam !== 'ALL') {
      // Validate status is a valid StatusSurat enum value
      const validStatuses: StatusSurat[] = [
        'DRAFT',
        'SUBMITTED', 
        'VERIFIED',
        'APPROVED',
        'REJECTED',
        'ARCHIVED'
      ]
      
      if (validStatuses.includes(statusParam as StatusSurat)) {
        where.status = statusParam as StatusSurat
      }
    }
    
    // Search functionality
    if (search) {
      where.OR = [
        { nomorSurat: { contains: search, mode: 'insensitive' } },
        { namaPewaris: { contains: search, mode: 'insensitive' } },
        { 
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ]
    }
    
    // Get submissions with pagination
    const [submissions, total] = await Promise.all([
      prisma.suratPernyataan.findMany({
        where,
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
              namaPemohon: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.suratPernyataan.count({ where })
    ])
    
    // Format response data
    const formattedSubmissions = submissions.map(submission => ({
      id: submission.id,
      nomorSurat: submission.nomorSurat,
      namaPewaris: submission.namaPewaris,
      tanggalSurat: submission.tanggalSurat,
      status: submission.status,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      isGenerated: submission.isGenerated,
      downloadCount: submission.downloadCount,
      catatan: submission.catatan,
      user: submission.user,
      permohonan: submission.permohonan,
      // Additional useful fields
      tempatLahirPewaris: submission.tempatLahirPewaris,
      tanggalLahirPewaris: submission.tanggalLahirPewaris,
      alamatPewaris: submission.alamatPewaris,
      agamaPewaris: submission.agamaPewaris,
      pekerjaanPewaris: submission.pekerjaanPewaris
    }))
    
    return NextResponse.json({
      success: true,
      data: formattedSubmissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
    
  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get submissions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}