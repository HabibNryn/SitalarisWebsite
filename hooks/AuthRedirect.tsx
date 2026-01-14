// hooks/useAuthRedirect.ts - Versi sederhana
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const checkAuthAndRedirect = useCallback((targetPath: string = "/dashboard") => {
    if (status === "loading") return;

    if (session) {
      router.push(targetPath);
    } else {
      router.push("/login");
    }
  }, [session, status, router]);

  const getAuthState = useCallback(() => {
    return {
      isLoggedIn: !!session,
      isLoading: status === "loading",
      shouldRedirectToLogin: status !== "loading" && !session,
      shouldRedirectToDashboard: status !== "loading" && !!session,
    };
  }, [session, status]);

  return {
    // Method untuk auth check dan redirect
    checkAuthAndRedirect,
    
    // Auth state
    ...getAuthState(),
    session,
    status,
    
    // Helper untuk conditional rendering
    shouldShowContent: status !== "loading",
  };
}