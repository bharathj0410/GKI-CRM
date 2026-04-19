import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("GKI")
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const result = await db.collection("employee").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Employee deleted successfully!" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
