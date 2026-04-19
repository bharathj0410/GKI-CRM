import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'all', 'temp', or null for all
    
    const client = await clientPromise
    const db = client.db("GKI")
    
    let query = {}
    if (type === 'temp') {
      query = { employeeType: 'temp_employee' }
    } else if (type === 'regular') {
      query = { employeeType: { $in: ['crm_user', 'data_only'] } }
    }
    
    let data = await db.collection("employee").find(query).toArray()
    data = data.map(({ password, ...rest }) => rest);
    
    if (data.length){
      return NextResponse.json(data);
    }
    return NextResponse.json([]);
  } catch (err) {
    console.error("Error retrieving employees from MongoDB:", err);
    return NextResponse.json({ error: "Error Retrieving Employee from DB !!" }, { status: 500 });
  }
}
