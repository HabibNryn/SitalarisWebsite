// app/dashboard/user/status/page.tsx
import { Suspense } from "react";
import StatusClient from "./StatusClient";

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 px-4" />}>
      <StatusClient />
    </Suspense>
  );
}
