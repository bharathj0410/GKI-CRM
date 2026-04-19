import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("GKI")
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // Find the guest record (handle both "ID-AA000001" and "GKI/ID-AA000001" formats)
    const query = id.includes('/')
      ? { id }
      : {
          $or: [
            { id },
            { id: { $regex: `/${id}$` } }
          ]
        }

    const record = await db.collection("guestData").findOne(query)

    if (!record) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    if (record.type === "customer") {
      return NextResponse.json({ error: "This record is already a customer" }, { status: 400 })
    }

    // Update the type to "customer"
    await db.collection("guestData").updateOne(
      { _id: record._id },
      { $set: { type: "customer" } }
    )

    return NextResponse.json({ message: "Guest successfully moved to Customer!" })

  } catch (err) {
    console.error("Error moving guest to customer:", err)
    return NextResponse.json({ error: "Failed to move guest to customer" }, { status: 500 })
  }
}
