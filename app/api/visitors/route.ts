import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy = searchParams.get("sortBy") || "checkIn";
    const sortDir = searchParams.get("sortDir") === "asc" ? 1 : -1;

    const query: Record<string, any> = {};

    if (status && status !== "all") query.status = status;
    if (type && type !== "all") query.visitorType = type;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    if (dateFrom || dateTo) {
      query.checkIn = {};
      if (dateFrom) query.checkIn.$gte = new Date(dateFrom);
      if (dateTo) query.checkIn.$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;
    const total = await db.collection("visitors").countDocuments(query);
    const data = await db
      .collection("visitors")
      .find(query)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    console.error("GET /api/visitors error:", err);

    return NextResponse.json(
      { error: "Failed to fetch visitors" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const body = await req.json();

    // Auto-generate gate pass number
    const lastVisitor = await db
      .collection("visitors")
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    let gatePassNumber = "GP-001";

    if (lastVisitor.length > 0 && lastVisitor[0].gatePassNumber) {
      const lastNum =
        parseInt(lastVisitor[0].gatePassNumber.replace("GP-", "")) || 0;

      gatePassNumber = `GP-${String(lastNum + 1).padStart(3, "0")}`;
    }

    const visitorData = {
      // Personal
      fullName: body.fullName || "",
      phone: body.phone || "",
      alternatePhone: body.alternatePhone || "",
      email: body.email || "",
      company: body.company || "",
      designation: body.designation || "",
      visitorType: body.visitorType || "other",
      groupSize: Number(body.groupSize) || 1,
      photo: body.photo || "",
      address: body.address || "",
      city: body.city || "",
      state: body.state || "",

      // Visit
      checkIn: body.checkIn ? new Date(body.checkIn) : new Date(),
      checkOut: body.checkOut ? new Date(body.checkOut) : null,
      purposeOfVisit: body.purposeOfVisit || "",
      visitDetails: body.visitDetails || "",
      meetingWith: body.meetingWith || "",
      visitLocation: body.visitLocation || "",
      expectedDuration: body.expectedDuration || "",
      expectedExitTime: body.expectedExitTime
        ? new Date(body.expectedExitTime)
        : null,
      remarks: body.remarks || "",
      isRecurring: !!body.isRecurring,
      recurringFrequency: body.recurringFrequency || "",

      // Security
      providedIDProofs: Array.isArray(body.providedIDProofs)
        ? body.providedIDProofs
        : [],
      idNumber: body.idNumber || "",
      hasVehicle: !!body.hasVehicle,
      vehicleNumber: body.vehicleNumber || "",
      vehicleType: body.vehicleType || "",
      materialsCarriedIn: Array.isArray(body.materialsCarriedIn)
        ? body.materialsCarriedIn
        : [],
      materialsCarriedOut: "",
      safetyBriefingGiven: !!body.safetyBriefingGiven,
      ndaSigned: !!body.ndaSigned,
      gatePassNumber: body.gatePassNumber || gatePassNumber,
      securityGuard: body.securityGuard || "",
      attachments: Array.isArray(body.attachments) ? body.attachments : [],

      // Signatures & Status
      visitorSignature: body.visitorSignature || "",
      securitySignature: body.securitySignature || "",
      exitSignature: "",
      status: "inside",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("visitors").insertOne(visitorData);

    if (!result.acknowledged) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Visitor registered successfully",
      id: result.insertedId,
      gatePassNumber: visitorData.gatePassNumber,
    });
  } catch (err) {
    console.error("POST /api/visitors error:", err);

    return NextResponse.json(
      { error: "Failed to create visitor" },
      { status: 500 },
    );
  }
}
