import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Generate unique employee ID
async function generateEmployeeId(db: any, employeeType: string): Promise<string> {
  const prefix = employeeType === 'temp_employee' ? 'TEMP' : 'EMP'
  const year = new Date().getFullYear()
  
  // Get the last employee ID for this year and type
  const lastEmployee = await db.collection("employee")
    .find({ employeeId: new RegExp(`^${prefix}-${year}-`) })
    .sort({ employeeId: -1 })
    .limit(1)
    .toArray()
  
  let sequence = 1
  if (lastEmployee.length > 0) {
    const lastId = lastEmployee[0].employeeId
    const lastSequence = parseInt(lastId.split('-')[2])
    sequence = lastSequence + 1
  }
  
  // Format: EMP-2025-0001 or TEMP-2025-0001
  return `${prefix}-${year}-${sequence.toString().padStart(4, '0')}`
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("GKI")
    const body = await req.json()
    
    // Generate unique employee ID
    const employeeId = await generateEmployeeId(db, body.employeeType || 'crm_user')
    
    // Add system fields
    const employeeData = {
      ...body,
      employeeId,
      isVerified: false,
      verifiedBy: null,
      verifiedAt: null,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const data = await db.collection("employee").insertOne(employeeData)
    
    if (!data.acknowledged) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: "The employee was successfully registered!", 
      id: data.insertedId,
      employeeId: employeeId
    });
  } catch (err: any) {
    console.error("Error inserting into MongoDB:", err);
    if (err.code === 11000) {
      return NextResponse.json({ error: "Username is in use. Please choose another one." }, { status: 400 });
    }
    return NextResponse.json({ error: "MongoDB connection or insert failed" }, { status: 500 });
  }
}
