// pages/api/test.ts or app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const body = await req.json();

    // Generate visitor ID
    const lastVisitor = await db
      .collection("visitors")
      .find()
      .sort({ visitorId: -1 })
      .limit(1)
      .toArray();

    let newVisitorId = "VIS001";

    if (lastVisitor.length > 0 && lastVisitor[0].visitorId) {
      const lastId = parseInt(lastVisitor[0].visitorId.replace("VIS", ""));

      newVisitorId = `VIS${String(lastId + 1).padStart(3, "0")}`;
    }

    const visitorData = {
      ...body,
      visitorId: newVisitorId,
      createdAt: new Date(),
    };

    const data = await db.collection("visitors").insertOne(visitorData);

    if (!data.acknowledged) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({
      message: "The Visitor was successfully added !",
      visitorId: newVisitorId,
    });
  } catch (err) {
    console.error("Error inserting into MongoDB:", err);

    return NextResponse.json(
      { error: "MongoDB connection or insert failed" },
      { status: 500 },
    );
  }
}
