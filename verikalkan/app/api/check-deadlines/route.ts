import { supabase } from "@/features/supabase/client";

export async function GET() {
  if (!supabase) return Response.json({ error: "DB yok" }, { status: 500 });

  const now = new Date();
  
  const { data: trackings } = await supabase
    .from("tracking")
    .select("*")
    .eq("result", "pending");

  if (!trackings) return Response.json({ checked: 0 });

  let sent = 0;

  for (const t of trackings) {
    const sentAt = new Date(t.deadline);
    sentAt.setDate(sentAt.getDate() - 30);
    const daysPassed = Math.floor((now.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysPassed >= 10 && !t.notif_10_sent) {
      await fetch(process.env.NEXT_PUBLIC_APP_URL + "/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: t.user_email, userName: t.user_name, companyName: t.company_name, dayNumber: 10 })
      });
      await supabase.from("tracking").update({ notif_10_sent: true }).eq("id", t.id);
      sent++;
    }

    if (daysPassed >= 25 && !t.notif_25_sent) {
      await fetch(process.env.NEXT_PUBLIC_APP_URL + "/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: t.user_email, userName: t.user_name, companyName: t.company_name, dayNumber: 25 })
      });
      await supabase.from("tracking").update({ notif_25_sent: true }).eq("id", t.id);
      sent++;
    }

    if (daysPassed >= 30) {
      await fetch(process.env.NEXT_PUBLIC_APP_URL + "/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: t.user_email, userName: t.user_name, companyName: t.company_name, dayNumber: 30 })
      });
      await supabase.from("tracking").update({ result: "notified" }).eq("id", t.id);
      sent++;
    }
  }

  return Response.json({ checked: trackings.length, sent });
}
