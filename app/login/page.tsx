// app/login/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const hasRedirectedRef = useRef(false);

  /**
   * Redirect user setelah login (FINAL & STABLE)
   */
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user) return;
    if (hasRedirectedRef.current) return;

    hasRedirectedRef.current = true;

    const role = session.user.role?.toUpperCase();
    const isAdmin =
      session.user.isAdmin ||
      role === "ADMIN" ||
      role === "SUPER_ADMIN";

    const targetPath = isAdmin
      ? "/dashboard/admin"
      : "/dashboard/user";

    router.replace(targetPath);
  }, [status, session, router]);

  /**
   * Loading saat cek session
   */
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memeriksa sesi...</p>
      </div>
    );
  }

  /**
   * Screen transisi saat authenticated (optional UX)
   */
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Mengarahkan ke dashboard...</p>
      </div>
    );
  }

  return <LoginForm />;
}
