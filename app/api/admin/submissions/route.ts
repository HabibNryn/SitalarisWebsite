// app/api/admin/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'

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

    const [data, total] = await Promise.all([
      prisma.suratPernyataan.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nomorSurat: true,
          kondisi: true,
          status: true,
          createdAt: true,
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.suratPernyataan.count()
    ])

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get submissions list error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil daftar submissions' },
      { status: 500 }
    )
  }
}
