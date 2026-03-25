import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Clock3,
  FileText,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
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

            <div className="hidden text-sm text-white/80 sm:block">
              KVKK Veri Hakları Asistanı
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Verini geri al.
            </h1>
            <p className="mt-6 text-lg text-slate-600 sm:text-xl">
              Hangi şirketlerin elinde ne var? KVKK haklarını 30 saniyede
              kullan.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90"
              >
                <Link href="/skor">Skorumu Öğren</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90"
              >
                <Link href="/dilekce">Dilekçe Oluştur</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1A56DB]/10 text-[#1A56DB]">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">
                    Skorunu Öğren
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    E-postanı gir, dijital riskini kısa sürede gör.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1A56DB]/10 text-[#1A56DB]">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">
                    Dilekçe Oluştur
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    KVKK haklarına uygun dilekçeyi AI ile üret.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1A56DB]/10 text-[#1A56DB]">
                  <Clock3 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">
                    30 Gün Takip
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Yanıt gecikirse hatırlatma ve şikayet adımın hazır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

