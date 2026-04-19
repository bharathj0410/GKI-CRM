import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')
    
    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db("GKI")
    
    // Try to find by employeeId first, then by _id if it's a valid ObjectId
    let employee = await db.collection("employee").findOne({ employeeId })
    
    if (!employee && ObjectId.isValid(employeeId)) {
      employee = await db.collection("employee").findOne({ _id: new ObjectId(employeeId) })
    }
    
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }
    
    return NextResponse.json({ employee })
  } catch (err) {
    console.error("Error fetching employee:", err)
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 })
  }
}
