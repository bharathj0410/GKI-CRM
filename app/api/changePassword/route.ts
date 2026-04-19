import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

import clientPromise from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const body = await req.json();
    const { _id, newPassword } = body;

    if (!_id || !newPassword) {
      return NextResponse.json(
        { error: "Employee ID and new password are required" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db
      .collection("employee")
      .updateOne(
        { _id: new ObjectId(_id) },
        { $set: { password: hashedPassword } },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Password changed successfully!" });
  } catch (err) {
    console.error("Error changing password:", err);

    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}
