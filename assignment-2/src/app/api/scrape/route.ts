import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { url } = await req.json();
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return NextResponse.json({ text });
}
