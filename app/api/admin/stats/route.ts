// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication & Authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is admin (using isAdmin field or role)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true, role: true }
    });
    
    if (!user?.isAdmin && user?.role !== 'admin' && user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // 2. Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('range') || 'monthly';
    
    // 3. Calculate date ranges
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'monthly':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    // 4. Fetch all statistics in parallel
    const [
      totalSuratPernyataan,
      pendingPermohonan,
      approvedSurat,
      totalUsers,
      totalPermohonan,
      completedPermohonan,
      monthlyData,
      recentActivity
    ] = await Promise.all([
      // Total Surat Pernyataan
      prisma.suratPernyataan.count(),
      
      // Pending Permohonan
      prisma.permohonanAhliWaris.count({
        where: { statusPermohonan: 'PENDING' }
      }),
      
      // Approved Surat
      prisma.suratPernyataan.count({
        where: { status: 'APPROVED' }
      }),
      
      // Total users
      prisma.user.count(),
      
      // Total Permohonan
      prisma.permohonanAhliWaris.count(),
      
      // Completed Permohonan
      prisma.permohonanAhliWaris.count({
        where: { statusPermohonan: 'COMPLETED' }
      }),
      
      // Monthly data for charts
      getMonthlyData(startDate),
      
      // Recent activity from document logs
      getRecentActivity()
    ]);
    
    // 5. Additional stats based on your schema
    const [
      draftedSurat,
      submittedSurat,
      verifiedSurat,
      rejectedSurat,
      archivedSurat,
      inReviewPermohonan,
      rejectedPermohonan,
      activeUsers
    ] = await Promise.all([
      prisma.suratPernyataan.count({ where: { status: 'DRAFT' } }),
      prisma.suratPernyataan.count({ where: { status: 'SUBMITTED' } }),
      prisma.suratPernyataan.count({ where: { status: 'VERIFIED' } }),
      prisma.suratPernyataan.count({ where: { status: 'REJECTED' } }),
      prisma.suratPernyataan.count({ where: { status: 'ARCHIVED' } }),
      prisma.permohonanAhliWaris.count({ where: { statusPermohonan: 'IN_REVIEW' } }),
      prisma.permohonanAhliWaris.count({ where: { statusPermohonan: 'REJECTED' } }),
      prisma.user.count({ where: { isActive: true } })
    ]);
    
    // 6. Prepare data for charts
    const suratStatusData = [
      {
        name: 'Draft',
        value: draftedSurat,
        color: '#94a3b8' // slate-400
      },
      {
        name: 'Submitted',
        value: submittedSurat,
        color: '#3b82f6' // blue-500
      },
      {
        name: 'Verified',
        value: verifiedSurat,
        color: '#8b5cf6' // violet-500
      },
      {
        name: 'Approved',
        value: approvedSurat,
        color: '#10b981' // green-500
      },
      {
        name: 'Rejected',
        value: rejectedSurat,
        color: '#ef4444' // red-500
      },
      {
        name: 'Archived',
        value: archivedSurat,
        color: '#6b7280' // gray-500
      }
    ];
    
    const permohonanStatusData = [
      {
        name: 'Pending',
        value: pendingPermohonan,
        color: '#f59e0b' // yellow-500
      },
      {
        name: 'In Review',
        value: inReviewPermohonan,
        color: '#3b82f6' // blue-500
      },
      {
        name: 'Approved',
        value: await prisma.permohonanAhliWaris.count({
          where: { statusPermohonan: 'APPROVED' }
        }),
        color: '#10b981' // green-500
      },
      {
        name: 'Rejected',
        value: rejectedPermohonan,
        color: '#ef4444' // red-500
      },
      {
        name: 'Completed',
        value: completedPermohonan,
        color: '#8b5cf6' // violet-500
      }
    ];
    
    // 7. System metrics
    const pdfGenerated = await prisma.suratPernyataan.count({
      where: { isGenerated: true }
    });
    
    const totalDownloads = await prisma.suratPernyataan.aggregate({
      _sum: { downloadCount: true }
    });
    
    // 8. Construct response
    const stats = {
      // Summary stats
      summary: {
        totalSuratPernyataan,
        totalPermohonan,
        totalUsers,
        activeUsers,
        pdfGenerated,
        totalDownloads: totalDownloads._sum.downloadCount || 0
      },
      
      // Surat Pernyataan stats
      suratStats: {
        total: totalSuratPernyataan,
        draft: draftedSurat,
        submitted: submittedSurat,
        verified: verifiedSurat,
        approved: approvedSurat,
        rejected: rejectedSurat,
        archived: archivedSurat
      },
      
      // Permohonan stats
      permohonanStats: {
        total: totalPermohonan,
        pending: pendingPermohonan,
        inReview: inReviewPermohonan,
        approved: await prisma.permohonanAhliWaris.count({
          where: { statusPermohonan: 'APPROVED' }
        }),
        rejected: rejectedPermohonan,
        completed: completedPermohonan
      },
      
      // Chart data
      charts: {
        monthlyData,
        suratStatusData,
        permohonanStatusData
      },
      
      // Activity
      recentActivity,
      
      // System metrics
      systemMetrics: {
        avgSuratPerUser: totalUsers > 0 ? (totalSuratPernyataan / totalUsers).toFixed(2) : '0',
        approvalRate: totalSuratPernyataan > 0 
          ? ((approvedSurat / totalSuratPernyataan) * 100).toFixed(1) 
          : '0',
        completionRate: totalPermohonan > 0
          ? ((completedPermohonan / totalPermohonan) * 100).toFixed(1)
          : '0'
      },
      
      metadata: {
        lastUpdated: new Date().toISOString(),
        timeRange,
        dataPoints: monthlyData.length
      }
    };
    
    return NextResponse.json({
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function: Get monthly data
async function getMonthlyData(startDate: Date) {
  const now = new Date();
  const months = [];
  
  // Get data for last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const [suratCount, permohonanCount, completedCount] = await Promise.all([
      // Surat Pernyataan created in month
      prisma.suratPernyataan.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      }),
      
      // Permohonan created in month
      prisma.permohonanAhliWaris.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      }),
      
      // Permohonan completed in month
      prisma.permohonanAhliWaris.count({
        where: {
          statusPermohonan: 'COMPLETED',
          updatedAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })
    ]);
    
    months.push({
      month: date.toLocaleDateString('id-ID', { month: 'short' }),
      fullMonth: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      suratPernyataan: suratCount,
      permohonan: permohonanCount,
      completed: completedCount
    });
  }
  
  return months;
}

// Helper function: Get recent activity
async function getRecentActivity() {
  const activities = await prisma.documentLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      suratPernyataan: {
        select: {
          nomorSurat: true,
          namaPewaris: true
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  
  return activities.map(log => {
    let actionText = '';
    let icon = '📄';
    
    switch (log.action) {
      case 'CREATE':
        actionText = `Membuat surat ${log.suratPernyataan?.nomorSurat || 'baru'}`;
        icon = '📝';
        break;
      case 'UPDATE':
        actionText = `Memperbarui surat ${log.suratPernyataan?.nomorSurat || ''}`;
        icon = '✏️';
        break;
      case 'DOWNLOAD':
        actionText = `Mengunduh surat ${log.suratPernyataan?.nomorSurat || ''}`;
        icon = '⬇️';
        break;
      case 'GENERATE_PDF':
        actionText = `Generate PDF untuk ${log.suratPernyataan?.nomorSurat || ''}`;
        icon = '📄';
        break;
      case 'STATUS_CHANGE':
        actionText = `Mengubah status surat ${log.suratPernyataan?.nomorSurat || ''}`;
        icon = '🔄';
        break;
      default:
        actionText = `Aksi ${log.action} pada surat`;
    }
    
    return {
      id: log.id,
      user: log.user?.name || log.user?.email || 'System',
      action: actionText,
      details: log.details,
      time: formatTimeAgo(log.createdAt),
      icon,
      type: log.action.toLowerCase()
    };
  });
}

// Helper function: Format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) {
    return 'Baru saja';
  } else if (diffMins < 60) {
    return `${diffMins} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  }
}