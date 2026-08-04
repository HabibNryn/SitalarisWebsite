// app/dashboard/admin/users/[userId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  FileText,
  Phone,
  ShieldCheck,
} from "lucide-react";
import LetterTable from "@/components/admin/users/LetterTable";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { userId } = await params;

  // Auth guard
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true, role: true },
  });
  if (
    !adminUser?.isAdmin &&
    !["admin", "super_admin"].includes(adminUser?.role ?? "")
  ) {
    return notFound();
  }

  // Ambil user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      phone: true,
      isActive: true,
      role: true,
      _count: { select: { suratPernyataan: true } },
    },
  });

  if (!user) return notFound();

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "dd MMMM yyyy", { locale: id });
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user.name || "Pengguna"}
          </h1>
          <p className="mt-1 text-gray-600">
            Detail profil dan daftar surat pengguna
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar
          </Link>
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Pengguna
          </CardTitle>
          <CardDescription>
            Informasi akun dan statistik aktivitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium text-gray-900">{user.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Tanggal Daftar</p>
                <p className="font-medium text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Status Akun</p>
                <Badge
                  className={
                    user.isActive
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }
                >
                  {user.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Total Surat</p>
                <p className="font-medium text-gray-900">
                  {user._count.suratPernyataan} surat
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Letters Table */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
          <FileText className="h-5 w-5 text-blue-600" />
          Daftar Surat Pengguna
        </h2>
        <LetterTable userId={user.id} />
      </div>
    </div>
  );
}
