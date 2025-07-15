import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { url, summary, urdu } = await req.json();
  const { error } = await supabase
    .from("summaries")
    .insert([{ url, summary, urdu_summary: urdu }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
