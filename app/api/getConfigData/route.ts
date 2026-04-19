// pages/api/test.ts or app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("GKI")
    const tableName = req.nextUrl.searchParams.get('tableName')
    const hasPrice = req.nextUrl.searchParams.get('hasPrice')
    const forDropDown = req.nextUrl.searchParams.get('forDropDown')
    if (!tableName) {
      return NextResponse.json({ error: "Missing tableName in query" }, { status: 400 });
    }

    const data = await db.collection("config").findOne({});
    const items = data?.[tableName]
    if (hasPrice == "true" || forDropDown == "true") {
      if (items) {
        return NextResponse.json(items);
      } else {
        return NextResponse.json([]);
      }
    }
    if (items) {
      const keysArray = items.map((item: any) => item.key);
      return NextResponse.json(keysArray);
    } else {
      return NextResponse.json([]);
    }

  } catch (err) {
    console.error("Error inserting into MongoDB:", err);
    return NextResponse.json({ error: "Error Retrieving Employee from DB !!" }, { status: 500 });
  }
}
