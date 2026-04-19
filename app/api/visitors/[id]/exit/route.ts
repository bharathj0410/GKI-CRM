import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("GKI");
    const body = await req.json();

    const updateData = {
      checkOut: body.checkOut ? new Date(body.checkOut) : new Date(),
      materialsCarriedOut: body.materialsCarriedOut || "",
      exitSignature: body.exitSignature || "",
      securityGuardExit: body.securityGuardExit || "",
      status: "exited",
      updatedAt: new Date(),
    };

    const result = await db
      .collection("visitors")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });

    return NextResponse.json({
      message: "Visitor marked as exited successfully",
    });
  } catch (err) {
    console.error("PUT /api/visitors/[id]/exit error:", err);

    return NextResponse.json({ error: "Failed to mark exit" }, { status: 500 });
  }
}
