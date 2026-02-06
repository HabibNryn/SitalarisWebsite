import { FormValues } from "../constants/schemas";

// /app/dashboard/SuratPernyataan/types/status.ts
export type StatusPengajuan = {
  id: string;
  userId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  step: 1 | 2 | 3 | 4 | 5;
  submittedAt?: Date;
  verifiedAt?: Date;
  approvedAt?: Date;
  completedAt?: Date;
  notes?: string;
  data: FormValues;
};

export type ProgressStep = {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
  icon: string;
  action?: string;
};
