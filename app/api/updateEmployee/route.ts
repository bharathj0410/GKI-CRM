import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("GKI")
    const body = await req.json()
    const { _id, employeeId, ...updateData } = body
    
    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString()
    
    let query: any
    if (_id) {
      query = { _id: new ObjectId(_id) }
    } else if (employeeId) {
      query = { employeeId }
    } else {
      return NextResponse.json({ error: "Employee ID or _id is required" }, { status: 400 });
    }

    const result = await db.collection("employee").updateOne(
      query,
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Employee updated successfully!",
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}
