import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import SkorPageClient from "@/features/score/SkorPageClient";

export default function SkorPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="bg-[#1E3A5F]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold">VeriKalkan</span>
            </div>

            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-white/80 hover:text-white"
              >
                Ana Sayfa
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

      <main>
        <SkorPageClient />
      </main>
    </div>
  );
}

