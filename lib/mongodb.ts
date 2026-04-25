// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createMongoClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(
      new Error("MONGODB_URI is not configured in environment variables"),
    );
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createMongoClientPromise();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createMongoClientPromise();
}

export default clientPromise;
