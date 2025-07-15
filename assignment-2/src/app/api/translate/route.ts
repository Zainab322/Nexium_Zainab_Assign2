import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    if (!text || !language) {
      return NextResponse.json(
        { error: "Missing text or language" },
        { status: 400 }
      );
    }
    const lingvaUrl = `https://lingva.ml/api/v1/en/${language}/${encodeURIComponent(
      text
    )}`;

    const res = await fetch(lingvaUrl, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Lingva error:", res.statusText);
      return NextResponse.json(
        { error: "Translation failed" },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json({ translated: data.translation });
  } catch (err) {
    console.error("Translation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
