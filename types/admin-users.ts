// Shared types untuk halaman admin users & surat

export type LetterStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "VERIFIED"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED"
  | "EXPIRED"
  | "COMPLETED"
  | "SENT";

export interface UserSummary {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  totalLetters: number;
  /** Status surat terbaru (yang paling baru dibuat), null jika belum punya surat */
  latestStatus: LetterStatus | null;
  latestLetterAt: string | null;
}

export interface LetterItem {
  id: string;
  nomorSurat: string;
  kondisi: string;
  status: LetterStatus;
  createdAt: string;
  updatedAt: string;
  pdfUrl: string | null;
  pdfFileName: string | null;
  sentAt: string | null;
  isGenerated: boolean;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  phone: string | null;
  isActive: boolean;
  role: string;
  totalLetters: number;
}

export interface UsersApiResponse {
  success: boolean;
  data: UserSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LettersApiResponse {
  success: boolean;
  data: {
    user: UserProfile;
    letters: LetterItem[];
  };
}
