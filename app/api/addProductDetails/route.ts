import { NextRequest, NextResponse } from "next/server";

import { incrementBillNumber } from "../utils/common";

import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const body = await req.json();

    if (body.id) {
      // Efficiently update product details by id
      // Remove id from updateFields to avoid updating immutable field
      const { id, ...rest } = body;
      // Create updateFields without id
      const updateFields = { ...rest };

      // Remove any accidental _id field as well
      // delete updateFields.id
      delete updateFields._id;
      console.log(id);
      const result = await db
        .collection("orderData")
        .findOneAndUpdate(
          { id },
          { $set: updateFields },
          { upsert: false, returnDocument: "after" },
        );

      console.log(result);
      if (!result) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        message: "Product details updated!",
        product: result.value,
      });
    } else {
      // Efficiently insert new product details
      const lastProduct = await db
        .collection("orderData")
        .find({}, { projection: { id: 1 } })
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      const newId = lastProduct.length
        ? incrementBillNumber(lastProduct[0].id)
        : "GKI/ID-AA000001";
      const insertResult = await db
        .collection("orderData")
        .insertOne({ ...body, id: newId });

      if (!insertResult.acknowledged) {
        return NextResponse.json({ error: "Insert failed" }, { status: 500 });
      }

      return NextResponse.json({
        message: "The BillInfo was successfully added!",
        id: newId,
      });
    }
  } catch (err: any) {
    console.error("Error in MongoDB operation:", err);
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate key error" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "MongoDB operation failed" },
      { status: 500 },
    );
  }
}
