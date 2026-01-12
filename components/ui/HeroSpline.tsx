"use client";
import Spline from "@splinetool/react-spline";

export default function HeroSpline() {
  const url = process.env.NEXT_PUBLIC_SPLINE_URL || process.env.SPLINE_URL;
  return (
    <div className="relative aspect-[16/6] md:aspect-[16/5]">
      {url ? (
        <Spline scene={url} />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-slate-300">
          Provide NEXT_PUBLIC_SPLINE_URL in .env
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Inheritance Certificate Services
        </h1>
        <p className="text-slate-300 text-sm">Secure. Trusted. Digital.</p>
      </div>
    </div>
  );
}