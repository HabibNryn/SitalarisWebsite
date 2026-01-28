// app/api/admin/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'
import { Prisma, StatusSurat } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true, role: true }
    })

    if (!user?.isAdmin && !['admin', 'super_admin'].includes(user?.role ?? '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(Number(searchParams.get('page') ?? 1), 1)
    const limit = Math.min(Number(searchParams.get('limit') ?? 10), 50)
    const skip = (page - 1) * limit
    
    // Get filter parameters
    const statusFilter = searchParams.get('status')
    const search = searchParams.get('search')
    
    // Build where clause dengan type yang tepat
    const where: Prisma.SuratPernyataanWhereInput = {}
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'ALL') {
      // Validasi status sesuai enum
      const validStatuses: StatusSurat[] = [
        'DRAFT',
        'SUBMITTED',
        'VERIFIED',
        'APPROVED',
        'REJECTED',
        'ARCHIVED'
      ]
      
      if (validStatuses.includes(statusFilter as StatusSurat)) {
        where.status = statusFilter as StatusSurat
      }
    }
    
    // Apply search filter dengan type yang tepat
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
      ] as Prisma.SuratPernyataanWhereInput['OR']
    }

    const [data, total] = await Promise.all([
      prisma.suratPernyataan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nomorSurat: true,
          kondisi: true,
          status: true,
          createdAt: true,
          reviewedAt: true,
          catatan: true,
          isGenerated: true,
          downloadCount: true,
          pdfFileName: true,
          user: {
            select: { 
              id: true,
              name: true, 
              email: true 
            }
          }
        }
      }),
      prisma.suratPernyataan.count({ where })
    ])
    
    // Format response untuk match dengan interface frontend
    const formattedData = data.map(item => ({
      id: item.id,
      nomorSurat: item.nomorSurat,
      kondisi: item.kondisi,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      reviewedAt: item.reviewedAt?.toISOString() || null,
      catatan: item.catatan || undefined,
      isGenerated: item.isGenerated,
      downloadCount: item.downloadCount,
      pdfUrl: item.pdfFileName ? `/api/submissions/${item.id}/download` : null,
      pdfGenerated: item.isGenerated,
      user: {
        id: item.user.id,
        name: item.user.name,
        email: item.user.email
      }
    }))

    return NextResponse.json({
      success: true,
      data: formattedData,
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
    console.error('Get submissions list error:', error)
    return NextResponse.json(
      { 
        error: 'Gagal mengambil daftar submissions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}