// pages/api/test.ts or app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    let data = await db.collection("visitors").find().toArray();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error inserting into MongoDB:", err);

    return NextResponse.json(
      { error: "Error Retrieving Employee from DB !!" },
      { status: 500 },
    );
  }
}
