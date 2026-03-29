import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import PetitionForm from "@/features/petition/PetitionForm";

export const metadata = {
  title: "Dilekçe Oluştur | VeriKalkan",
  description:
    "KVKK kapsamında kişisel veri haklarınızı kullanmak için dilekçe oluşturun.",
};

export default function DilecePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-[#1E3A5F] sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold">VeriKalkan</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-white/80 hover:text-white">
                Dashboard
              </Link>
              <Link
                href="/dilekce"
                className="text-sm text-white/80 hover:text-white"
              >
                Dilekçe
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="bg-[#1E3A5F] pb-8 pt-2">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h1 className="text-2xl font-bold text-white">Dilekçe Oluştur</h1>
          <p className="mt-1 text-sm text-blue-200">
            3 adımda KVKK hakkınızı kullanın
          </p>
        </div>
      </div>

      {/* Form */}
      <main className="-mt-4">
        <PetitionForm />
      </main>
    </div>
  );
}
