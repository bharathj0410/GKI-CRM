import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("GKI")
    
    const result = await db.collection("visitors").deleteOne({ 
      _id: new ObjectId(id) 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      message: "Visitor deleted successfully",
      deletedCount: result.deletedCount 
    })
  } catch (err) {
    console.error("Error deleting visitor from MongoDB:", err)
    return NextResponse.json({ 
      error: "Failed to delete visitor" 
    }, { status: 500 })
  }
}
