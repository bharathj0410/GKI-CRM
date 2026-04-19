import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");

    // Check if admin already exists
    const existingAdmin = await db
      .collection("employee")
      .findOne({ username: "admin" });

    if (existingAdmin) {
      return NextResponse.json(
        {
          message:
            "Admin user already exists. You can login with username: admin",
        },
        { status: 200 },
      );
    }

    // Create temporary admin user
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const adminData = {
      name: "Admin User",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      permissions: [
        "dashboard",
        "employee",
        "stocks",
        "costing",
        "visitors",
        "job",
      ],
      createdAt: new Date(),
    };

    const result = await db.collection("employee").insertOne(adminData);

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "Failed to create admin user" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Temporary admin user created successfully!",
        credentials: {
          username: "admin",
          password: "Admin@123",
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error creating admin user:", err);

    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 },
    );
  }
}
