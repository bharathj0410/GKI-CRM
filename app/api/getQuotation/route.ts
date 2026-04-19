import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("GKI");

    // Handle both formats: "ID-AA000001" and "GKI/ID-AA000001"
    const query = id.includes('/') 
      ? { "order_data.id": id } 
      : { $or: [
          { "order_data.id": id },
          { "order_data.id": { $regex: `/${id}$` } }
        ]};

    const data = await db.collection("quotations").find(query).toArray();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error retrieving from MongoDB:", err);
    return NextResponse.json({ error: "Error Retrieving Data from DB" }, { status: 500 });
  }
}
