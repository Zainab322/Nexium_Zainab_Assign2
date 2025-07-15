import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI!);

export async function POST(req: Request) {
  const { url, fullText } = await req.json();
  await client.connect();
  const db = client.db("blogdb");
  await db.collection("fulltexts").insertOne({ url, fullText });
  return NextResponse.json({ ok: true });
}
