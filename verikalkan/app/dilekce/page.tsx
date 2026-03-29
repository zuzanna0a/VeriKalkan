"use client";

import DarkLayout from "@/components/DarkLayout";
import PetitionForm from "@/features/petition/PetitionForm";

export default function DilekcePage() {
  return (
    <DarkLayout title="Dilekçe Oluştur">
      <main className="py-12">
        <PetitionForm />
      </main>
    </DarkLayout>
  );
}
