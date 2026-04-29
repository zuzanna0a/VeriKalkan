import { supabaseAdmin } from "@/features/supabase/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email || !supabaseAdmin) {
    return Response.json({ trackings: [] });
  }

  const { data } = await supabaseAdmin
    .from("tracking")
    .select("*")
    .eq("user_email", email)
    .eq("result", "pending")
    .order("deadline", { ascending: true });

  return Response.json({ trackings: data || [] });
}
