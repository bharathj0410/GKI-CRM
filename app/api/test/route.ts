import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const data = await db.collection("employee").find({}).toArray();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    NextResponse.json({ error: "MongoDB connection failed" }, { status: 400 });
  }
}
