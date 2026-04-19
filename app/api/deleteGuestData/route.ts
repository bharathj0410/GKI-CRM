import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Find the guest/customer record (handle both "ID-AA000001" and "GKI/ID-AA000001" formats)
    const query = id.includes("/")
      ? { id }
      : {
          $or: [{ id }, { id: { $regex: `/${id}$` } }],
        };

    const record = await db.collection("guestData").findOne(query);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const recordId = record.id;

    // Delete all order data (products) belonging to this guest/customer
    await db.collection("orderData").deleteMany({
      $or: [{ parentId: recordId }, { parentId: id }],
    });

    // Delete the guest/customer record itself
    await db.collection("guestData").deleteOne({ _id: record._id });

    return NextResponse.json({
      message: "Record and all associated products deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting guest/customer:", err);

    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 },
    );
  }
}
