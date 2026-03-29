import { supabase } from "@/features/supabase/client";

export async function POST(req: Request) {
  const body = await req.json();
  const { userEmail, userName, companyName, dpoEmail, rightType } = body;

  if (!supabase) {
    return Response.json({ error: "Veritabanı bağlantısı yok" }, { status: 500 });
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  // Find the latest petition for this user+company
  const { data: petition } = await supabase
    .from("petitions")
    .select("id")
    .eq("user_email", userEmail)
    .eq("company_name", companyName)
    .order("sent_at", { ascending: false })
    .limit(1)
    .single();

  const { data: tracking, error } = await supabase
    .from("tracking")
    .insert([{
      petition_id: petition?.id || null,
      user_email: userEmail,
      user_name: userName,
      company_name: companyName,
      deadline: deadline.toISOString(),
      notif_10_sent: false,
      notif_25_sent: false,
      result: "pending"
    }])
    .select()
    .single();

  if (error) {
    console.error("Tracking insert hatası:", error);
    return Response.json({ error: "Takip kaydedilemedi" }, { status: 500 });
  }

  return Response.json({ success: true, trackingId: tracking.id });
}
