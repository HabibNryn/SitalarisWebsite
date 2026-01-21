// app/dashboard/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Users
} from 'lucide-react'

interface DashboardStats {
  totalSubmissions: number
  pendingSubmissions: number
  approvedSubmissions: number
  rejectedSubmissions: number
  totalUsers: number
  monthlyData: Array<{
    month: string
    submissions: number
    approvals: number
  }>
  statusData: Array<{
    name: string
    value: number
    color: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchDashboardStats()
  }, [])
  
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  const statCards = [
    {
      title: 'Total Pengajuan',
      value: stats?.totalSubmissions || 0,
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Menunggu Review',
      value: stats?.pendingSubmissions || 0,
      icon: <Clock className="w-8 h-8" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Disetujui',
      value: stats?.approvedSubmissions || 0,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Ditolak',
      value: stats?.rejectedSubmissions || 0,
      icon: <XCircle className="w-8 h-8" />,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Total Pengguna',
      value: stats?.totalUsers || 0,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ]
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">
          Selamat datang di panel administrasi Sitalaris
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color} bg-opacity-10`}>
                  <div className={card.textColor}>{card.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Submissions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="submissions" name="Total Pengajuan" fill="#8884d8" />
                  <Bar dataKey="approvals" name="Disetujui" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.statusData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats?.statusData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Surat Pernyataan Baru</p>
                    <p className="text-sm text-gray-500">SP/20240123/ABC123 diajukan oleh John Doe</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 jam yang lalu</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}