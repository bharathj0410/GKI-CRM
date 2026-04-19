import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise
        const db = client.db("GKI")
        const body = await req.json()
        const key = body["key"]; // e.g., "box_types"
        const hasPrice = body["hasPrice"]; // e.g., "box_types"
        // const data = await db.collection("employee")

        // Check if "config" collection exists
        const collections = await db.listCollections({}, { nameOnly: true }).toArray();
        const configExists = collections.some((col) => col.name === "config");

        // let data:{"key":string,"value":Array<string>} = { "key":"Box Type","value": ["Universal Box"] };
        let updatedData = <any>[]
        if(hasPrice){
            body["value"].forEach((item:{key:string,price:number}) => {
                updatedData.push({ key: item.key, label: item.key, price:item.price })
            });
        }else{
            body["value"].forEach((item:string) => {
                updatedData.push({ key: item, label: item })
            });
        }
        
        if (!configExists) {
            await (await db.createCollection("config")).insertOne({});
        }

        // Get the config document (assuming there's only one)

        const config = await db.collection("config").findOne({});
        const result = await db.collection("config").updateOne(
            { _id: config?._id },
            { $set: { [key]: updatedData  } }
        );

            if (!result.acknowledged) {
              return NextResponse.json({ error: "Insert failed" }, { status: 500 });
            }
            return NextResponse.json({ message: `${key} Table has been Updated !!` });
    } catch (err) {
        console.error("Error inserting into MongoDB:", err);
        if (err.code === 11000) {
            return NextResponse.json({ error: "Username is in use. Please choose another one." }, { status: 400 });
        }
        return NextResponse.json({ error: "MongoDB connection or insert failed" }, { status: 500 });
    }
}
