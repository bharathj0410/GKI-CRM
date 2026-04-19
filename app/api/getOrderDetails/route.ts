// pages/api/test.ts or app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const parentId = req.nextUrl.searchParams.get("parentId");
    const id = req.nextUrl.searchParams.get("id");
    const client = await clientPromise;
    const db = client.db("GKI");
    let data: any[] = [];

    if (parentId) {
      // Handle both formats: "ID-AA000001" and "GKI/ID-AA000001"
      const parentQuery = parentId.includes("/")
        ? { parentId }
        : { $or: [{ parentId }, { parentId: { $regex: `/${parentId}$` } }] };

      if (id) {
        const idQuery = id.includes("/")
          ? { id }
          : { $or: [{ id }, { id: { $regex: `/${id}$` } }] };

        data = await db
          .collection("orderData")
          .find({ $and: [parentQuery, idQuery] })
          .toArray();
      } else {
        data = await db.collection("orderData").find(parentQuery).toArray();
      }
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
