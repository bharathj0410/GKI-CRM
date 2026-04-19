// pages/api/test.ts or app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const guestId = req.nextUrl.searchParams.get("id");
    const client = await clientPromise;
    const db = client.db("GKI");
    let data = null;

    if (guestId) {
      // Handle both formats: "ID-AA000001" and "GKI/ID-AA000001"
      // If the id doesn't contain a slash, search for records ending with the id
      const query = guestId.includes("/")
        ? { id: guestId }
        : { $or: [{ id: guestId }, { id: { $regex: `/${guestId}$` } }] };

      data = await db.collection("guestData").find(query).toArray();
    } else {
      data = await db.collection("guestData").find().toArray();
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error inserting into MongoDB:", err);

    return NextResponse.json(
      { error: "Error Retrieving Employee from DB !!" },
      { status: 500 },
    );
  }
}
