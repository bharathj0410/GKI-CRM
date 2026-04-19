// pages/api/test.ts or app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");
    const productId = req.nextUrl.searchParams.get("productId")?.split(",");
    const client = await clientPromise;
    const db = client.db("GKI");
    let orderData = null;
    let productData = null;

    if (orderId) {
      orderData = await db
        .collection("guestData")
        .find({ id: orderId })
        .toArray();
      productData = await db
        .collection("orderData")
        .find({ id: { $in: productId } })
        .toArray();
    } else {
      orderData = await db.collection("guestData").find().toArray();
    }

    return NextResponse.json({
      order_data: orderData[0],
      product_data: productData,
      product_quotation: [
        {
          "sl. No": 1,
          "Enquary date": "10/10/2025",
          "Product name": "Ice Cream Box",
          Size: "60*25*80",
          Quantity: "1000",
          "Die charges": "0.5",
          "Printing charges": "0.8",
          "Price per unit": "10",
        },
        {
          "sl. No": 2,
          "Enquary date": "10/10/2025",
          "Product name": "Ice Cream Box",
          Size: "60*25*80",
          Quantity: "1000",
          "Die charges": "0.5",
          "Printing charges": "0.8",
          "Price per unit": "10",
        },
      ],
      table_name: [
        "sl. No",
        "Enquary date",
        "Product name",
        "Size",
        "Quantity",
        "Die charges",
        "Printing charges",
        "Price per unit",
      ],
    });
  } catch (err) {
    console.error("Error inserting into MongoDB:", err);

    return NextResponse.json(
      { error: "Error Retrieving Employee from DB !!" },
      { status: 500 },
    );
  }
}
