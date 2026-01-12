// hooks/useAuthRedirect.ts
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsChecking(false);
    }
  }, [status]);

  const checkAuthAndRedirect = (targetPath: string = "/dashboard") => {
    if (status === "loading") return;

    if (session) {
      // User sudah login, arahkan ke target path (dashboard/default)
      router.push(targetPath);
    } else {
      // User belum login, arahkan ke login page
      router.push("/login");
    }
  };

  return {
    checkAuthAndRedirect,
    isLoggedIn: !!session,
    isChecking,
    session,
    status
  };
}