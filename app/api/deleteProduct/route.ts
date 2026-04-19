import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("GKI");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Delete the product itself
    const result = await db.collection("orderData").deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Also delete any sub-products that have this product as parent
    await db.collection("orderData").deleteMany({ parentId: id });

    return NextResponse.json({ message: "Product deleted successfully!" });
  } catch (err) {
    console.error("Error deleting product:", err);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
