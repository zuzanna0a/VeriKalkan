"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DarkLayout from "@/components/DarkLayout";

export default function TakipRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <DarkLayout title="30 Gün Takip">
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88] mb-6" />
        <p style={{ color: "#475569", fontFamily: "monospace", fontSize: "12px", letterSpacing: "2px" }}>
          // REDIRECTING TO DASHBOARD...
        </p>
      </div>
    </DarkLayout>
  );
}
