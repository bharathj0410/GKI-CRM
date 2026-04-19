import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("GKI");
    const visitor = await db
      .collection("visitors")
      .findOne({ _id: new ObjectId(id) });

    if (!visitor)
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });

    return NextResponse.json(visitor);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch visitor" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("GKI");
    const body = await req.json();

    const updateData: Record<string, any> = { ...body, updatedAt: new Date() };

    delete updateData._id;

    // Coerce dates
    if (updateData.checkIn) updateData.checkIn = new Date(updateData.checkIn);
    if (updateData.checkOut)
      updateData.checkOut = new Date(updateData.checkOut);
    if (updateData.expectedExitTime)
      updateData.expectedExitTime = new Date(updateData.expectedExitTime);

    const result = await db
      .collection("visitors")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });

    return NextResponse.json({ message: "Visitor updated successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update visitor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("GKI");
    const result = await db
      .collection("visitors")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });

    return NextResponse.json({ message: "Visitor deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete visitor" },
      { status: 500 },
    );
  }
}
