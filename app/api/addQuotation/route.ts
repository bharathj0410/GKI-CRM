// pages/api/test.ts or app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server";

import { incrementBillNumber } from "../utils/common";

import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const body = await req.json();
    let data;

    let existingdata = await db.collection("quotations").find().toArray();

    if (existingdata.length) {
      const lastObject = existingdata.at(-1);
      const id = incrementBillNumber(lastObject?.id);

      data = await db.collection("quotations").insertOne({ ...body, id: id });
    } else {
      data = await db
        .collection("quotations")
        .insertOne({ ...body, id: "GKI/ID-AA000001" });
    }
    if (!data.acknowledged) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }
    const billInfo = await db
      .collection("quotations")
      .findOne({ _id: data.insertedId });

    return NextResponse.json({
      message: "The Quotations was successfully added !",
      id: billInfo?.id,
    });
  } catch (err: any) {
    console.error("Error inserting into MongoDB:", err);
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "Something Went Wrong" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "MongoDB connection or insert failed" },
      { status: 500 },
    );
  }
}
