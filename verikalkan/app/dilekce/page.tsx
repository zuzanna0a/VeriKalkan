"use client";
import { Suspense } from "react";
import DarkLayout from "@/components/DarkLayout";
import PetitionForm from "@/features/petition/PetitionForm";

function DilekceContent() {
  return (
    <DarkLayout title="Dilekçe Oluştur">
      <main className="py-12">
        <PetitionForm />
      </main>
    </DarkLayout>
  );
}

export default function DilekcePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-xs text-vk-text-muted">Yükleniyor...</div>}>
      <DilekceContent />
    </Suspense>
  );
}
