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

    if (body.id) {
      data = await db
        .collection("guestData")
        .findOneAndUpdate({ id: body.id }, { age: 30 }, { upsert: true });
    } else {
      let existingdata = await db.collection("guestData").find().toArray();

      if (existingdata.length) {
        const lastObject = existingdata.at(-1);
        const id = incrementBillNumber(lastObject?.id);

        data = await db.collection("guestData").insertOne({ ...body, id: id });
      } else {
        data = await db
          .collection("guestData")
          .insertOne({ ...body, id: "GKI/ID-AA000001" });
      }
      if (!data.acknowledged) {
        return NextResponse.json({ error: "Insert failed" }, { status: 500 });
      }
      const guestInfo = await db
        .collection("guestData")
        .findOne({ _id: data.insertedId });

      return NextResponse.json({
        message: "Guest saved successfully!",
        id: guestInfo?.id,
      });
    }
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
