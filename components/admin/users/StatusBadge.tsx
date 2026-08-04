// components/admin/users/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { type LetterStatus } from "@/types/admin-users";

const STATUS_STYLES: Record<LetterStatus, { color: string; label: string }> = {
  DRAFT: {
    color: "bg-gray-100 text-gray-800 border border-gray-200",
    label: "Draft",
  },
  SUBMITTED: {
    color: "bg-blue-50 text-blue-700 border border-blue-200",
    label: "Submitted",
  },
  VERIFIED: {
    color: "bg-purple-50 text-purple-700 border border-purple-200",
    label: "Verified",
  },
  APPROVED: {
    color: "bg-green-50 text-green-700 border border-green-200",
    label: "Disetujui",
  },
  REJECTED: {
    color: "bg-red-50 text-red-700 border border-red-200",
    label: "Ditolak",
  },
  ARCHIVED: {
    color: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    label: "Arsip",
  },
  EXPIRED: {
    color: "bg-orange-50 text-orange-700 border border-orange-200",
    label: "Kedaluwarsa",
  },
  COMPLETED: {
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    label: "Selesai",
  },
  SENT: {
    color: "bg-teal-50 text-teal-700 border border-teal-200",
    label: "Terkirim",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status as LetterStatus];
  if (!style) {
    return (
      <Badge className="bg-gray-100 text-gray-800 border border-gray-200 font-medium px-3 py-1">
        {status}
      </Badge>
    );
  }
  return (
    <Badge className={`${style.color} font-medium px-3 py-1`}>
      {style.label}
    </Badge>
  );
}
