import type { ReactNode } from "react";

async function auth(): Promise<{ user: { role: string } } | null> {
  return null;
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return <div>Akses ditolak</div>;
  }

  return <>{children}</>;
}
