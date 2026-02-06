// /app/dashboard/user/SuratPernyataan/progress/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Clock, FileText, UserCheck, ShieldCheck } from "lucide-react";

export default function ProgressTrackingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pengajuanId, setPengajuanId] = useState<string | null>(null);

  // Simulasi data dari API
  const [progressData, setProgressData] = useState({
    step1: { status: "completed", date: "2024-01-15 10:30" },
    step2: { status: "pending", date: null },
    step3: { status: "pending", date: null },
    step4: { status: "pending", date: null },
    step5: { status: "pending", date: null },
  });

  useEffect(() => {
    // Ambil data progress dari API
    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/surat-pernyataan/progress");
        const data = await response.json();
        
        if (data.success) {
          setCurrentStep(data.currentStep);
          setPengajuanId(data.pengajuanId);
          setProgressData(data.progress);

          if (data.currentStep === 3 && data.pengajuanId) {
            router.replace(`/dashboard/user/permohonan?pengajuanId=${data.pengajuanId}`);
          }
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const steps = [
    {
      step: 1,
      title: "Mengisi Form Surat Pernyataan Ahli Waris",
      description: "Anda telah berhasil mengisi dan menyimpan data",
      status: progressData.step1.status,
      date: progressData.step1.date,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      step: 2,
      title: "Menunggu Verifikasi Admin",
      description: "Data Anda sedang diverifikasi oleh admin",
      status: progressData.step2.status,
      date: progressData.step2.date,
      icon: <Clock className="h-6 w-6" />,
      action: currentStep === 2 ? "verifikasi" : "pending",
    },
    {
      step: 3,
      title: "Mengisi Form Surat Permohonan Ahli Waris",
      description: "Setelah verifikasi, isi form permohonan",
      status: progressData.step3.status,
      date: progressData.step3.date,
      icon: <UserCheck className="h-6 w-6" />,
    },
    {
      step: 4,
      title: "Menunggu Persetujuan Admin",
      description: "Permohonan Anda sedang diproses",
      status: progressData.step4.status,
      date: progressData.step4.date,
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      step: 5,
      title: "Selesai",
      description: "Proses telah selesai, surat dapat diunduh",
      status: progressData.step5.status,
      date: progressData.step5.date,
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ];

  const handleContinue = () => {
    if (currentStep === 1) {
      // Jika step 1 selesai, arahkan ke progress page
      router.push("/dashboard/user/SuratPernyataan/progress");
    } else if (currentStep === 2) {
      // Step 2: Menunggu verifikasi (tidak ada aksi)
      // Tampilkan notifikasi
      alert("Mohon tunggu, data Anda sedang diverifikasi oleh admin.");
    } else if (currentStep === 3) {
      // Step 3: Arahkan ke form permohonan
      router.push(`/dashboard/user/permohonan?pengajuanId=${pengajuanId ?? ""}`);
    } else if (currentStep === 4) {
      // Step 4: Menunggu persetujuan
      alert("Permohonan Anda sedang diproses oleh admin.");
    } else if (currentStep === 5) {
      // Step 5: Selesai - arahkan ke halaman hasil
      router.push(`/dashboard/SuratPermohonan/hasil/${pengajuanId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Memuat progress pengajuan...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Progress Pengajuan Surat Ahli Waris</CardTitle>
          <CardDescription>
            Lacak status pengajuan surat ahli waris Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {steps.map((step, index) => (
              <div key={step.step} className="relative mb-8 last:mb-0">
                <div className="flex items-start">
                  {/* Step Icon */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-16 h-16 rounded-full
                    ${step.status === "completed" ? "bg-green-100 text-green-600" : 
                      step.status === "current" ? "bg-blue-100 text-blue-600" : 
                      "bg-gray-100 text-gray-400"}
                  `}>
                    {step.icon}
                  </div>

                  {/* Step Content */}
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <span className={`
                        px-3 py-1 text-sm rounded-full
                        ${step.status === "completed" ? "bg-green-100 text-green-800" : 
                          step.status === "current" ? "bg-blue-100 text-blue-800" : 
                          "bg-gray-100 text-gray-800"}
                      `}>
                        {step.status === "completed" ? "Selesai" : 
                         step.status === "current" ? "Sedang Berjalan" : "Menunggu"}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-1">{step.description}</p>
                    
                    {step.date && (
                      <p className="text-sm text-gray-500 mt-2">
                        <Clock className="inline-block h-3 w-3 mr-1" />
                        {new Date(step.date).toLocaleString("id-ID")}
                      </p>
                    )}

                    {step.step === currentStep && step.action && (
                      <div className="mt-4">
                        {step.action === "verifikasi" ? (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                              <p className="text-yellow-800">
                                Data Anda sedang diverifikasi oleh admin. Silakan tunggu konfirmasi.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <Button onClick={handleContinue} className="mt-2">
                            Lanjutkan
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    absolute left-8 top-16 bottom-0 w-0.5
                    ${step.status === "completed" ? "bg-green-300" : "bg-gray-200"}
                  `}></div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Kembali ke Dashboard
            </Button>
            
            {currentStep > 1 && currentStep < 5 && (
              <Button onClick={handleContinue}>
                {currentStep === 2 ? "Cek Status Verifikasi" : 
                 currentStep === 3 ? "Lanjutkan ke Form Permohonan" :
                 "Cek Status Persetujuan"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
