// app/dashboard/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  Archive,
  Download,
  Filter,
  TrendingUp,
  AlertCircle,
  XCircle,
  FileCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  summary: {
    totalSuratPernyataan: number
    totalPermohonan: number
    totalUsers: number
    activeUsers: number
    pdfGenerated: number
    totalDownloads: number
  }
  suratStats: {
    total: number
    draft: number
    submitted: number
    verified: number
    approved: number
    rejected: number
    archived: number
  }
  permohonanStats: {
    total: number
    pending: number
    inReview: number
    approved: number
    rejected: number
    completed: number
  }
  charts: {
    monthlyData: Array<{
      month: string
      suratPernyataan: number
      permohonan: number
      completed: number
    }>
    suratStatusData: Array<{
      name: string
      value: number
      color: string
    }>
    permohonanStatusData: Array<{
      name: string
      value: number
      color: string
    }>
  }
  recentActivity: Array<{
    id: string
    user: string
    action: string
    details?: string
    time: string
    icon: string
    type: string
  }>
  systemMetrics: {
    avgSuratPerUser: string
    approvalRate: string
    completionRate: string
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('monthly')
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchDashboardStats()
  }, [timeRange])
  
  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/stats?range=${timeRange}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch stats')
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }
  
  // Stat cards dengan perbaikan perhitungan
  const statCards = [
    {
      title: 'Total Surat Pernyataan',
      value: stats?.summary?.totalSuratPernyataan || 0,
      icon: <FileText className="w-5 h-5" />,
      color: 'border-l-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      trend: 'up' as const,
      description: 'Total semua surat'
    },
    {
      title: 'Permohonan Aktif',
      value: ((stats?.permohonanStats?.pending || 0) + (stats?.permohonanStats?.inReview || 0)),
      icon: <Clock className="w-5 h-5" />,
      color: 'border-l-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+5%',
      trend: 'up' as const,
      description: 'Pending + Review'
    },
    {
      title: 'Surat Disetujui',
      value: stats?.suratStats?.approved || 0,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'border-l-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+18%',
      trend: 'up' as const,
      description: 'Status approved'
    },
    {
      title: 'Permohonan Selesai',
      value: stats?.permohonanStats?.completed || 0,
      icon: <Archive className="w-5 h-5" />,
      color: 'border-l-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%',
      trend: 'up' as const,
      description: 'Status completed'
    },
    {
      title: 'Total Pengguna',
      value: stats?.summary?.totalUsers || 0,
      icon: <Users className="w-5 h-5" />,
      color: 'border-l-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      change: '+8%',
      trend: 'up' as const,
      description: `${stats?.summary?.activeUsers || 0} aktif`
    },
    {
      title: 'PDF Digenerate',
      value: stats?.summary?.pdfGenerated || 0,
      icon: <Download className="w-5 h-5" />,
      color: 'border-l-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+25%',
      trend: 'up' as const,
      description: `${stats?.summary?.totalDownloads || 0} downloads`
    }
  ]
  
  const timeRanges = [
    { label: 'Hari ini', value: 'today' },
    { label: 'Minggu ini', value: 'weekly' },
    { label: 'Bulan ini', value: 'monthly' },
    { label: 'Tahun ini', value: 'yearly' }
  ]
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardStats}>
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Ringkasan kinerja sistem dan aktivitas terbaru
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => fetchDashboardStats()}
          >
            <Filter className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              timeRange === range.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
      
      {/* Stats Grid - Compact Version */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{card.value.toLocaleString('id-ID')}</p>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      card.trend === 'up' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {card.change}
                    </span>
                  </div>
                  {card.description && (
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <div className={card.textColor}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends - Line Chart */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Trend Bulanan</CardTitle>
              <Badge variant="outline" className="text-xs">
                6 bulan terakhir
              </Badge>
            </div>
            <CardDescription>
              Perkembangan surat pernyataan dan permohonan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={stats?.charts?.monthlyData || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      backgroundColor: 'white'
                    }}
                    formatter={(value, name) => {
                      const label = name === 'suratPernyataan' ? 'Surat' 
                                 : name === 'permohonan' ? 'Permohonan' 
                                 : name === 'completed' ? 'Selesai' : name
                      return [`${value}`, label]
                    }}
                    labelFormatter={(label) => `Bulan: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="suratPernyataan" 
                    name="Surat Pernyataan"
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="permohonan" 
                    name="Permohonan"
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Status Permohonan - Pie Chart */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Status Permohonan</CardTitle>
            <CardDescription>
              Distribusi status permohonan ahli waris
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.charts?.permohonanStatusData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats?.charts?.permohonanStatusData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => {
                      const entry = props.payload;
                      return [`${value} permohonan`, entry?.name || name];
                    }}
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: 'white'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Stats and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Metrics */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Metrik Sistem</CardTitle>
            <CardDescription>
              Statistik performa sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rata-rata Surat per User</span>
                <span className="font-medium">{stats?.systemMetrics?.avgSuratPerUser || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tingkat Persetujuan</span>
                <span className="font-medium text-green-600">{stats?.systemMetrics?.approvalRate || '0'}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tingkat Penyelesaian</span>
                <span className="font-medium text-blue-600">{stats?.systemMetrics?.completionRate || '0'}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Download per PDF</span>
                <span className="font-medium">
                  {stats?.summary?.totalDownloads && stats?.summary?.pdfGenerated 
                    ? (stats.summary.totalDownloads / stats.summary.pdfGenerated).toFixed(1)
                    : '0'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-medium text-sm mb-3">Ringkasan Surat</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Draft</span>
                  <Badge variant="outline" className="text-gray-600">
                    {stats?.suratStats?.draft || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Submitted</span>
                  <Badge variant="outline" className="text-blue-600">
                    {stats?.suratStats?.submitted || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verified</span>
                  <Badge variant="outline" className="text-purple-600">
                    {stats?.suratStats?.verified || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rejected</span>
                  <Badge variant="outline" className="text-red-600">
                    {stats?.suratStats?.rejected || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Aktivitas Terkini</CardTitle>
            <CardDescription>
              Update terbaru dari sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-lg">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.action}</p>
                      {activity.details && (
                        <p className="text-xs text-gray-500 mt-0.5">{activity.details}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">Oleh: {activity.user}</p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada aktivitas terbaru</p>
                </div>
              )}
            </div>
            {stats?.recentActivity && stats.recentActivity.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full mt-4 text-sm">
                Lihat semua aktivitas →
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          <CardDescription>
            Navigasi cepat untuk admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start gap-2">
              <FileText className="w-4 h-4" />
              Kelola Surat
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Users className="w-4 h-4" />
              Kelola User
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Clock className="w-4 h-4" />
              Review Permohonan
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Download className="w-4 h-4" />
              Generate Laporan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}