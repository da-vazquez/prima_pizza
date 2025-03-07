import { MongoClient } from "mongodb";

// Use environment variables without NEXT_PUBLIC_ prefix for security
const uri = process.env.MONGODB_URL || process.env.NEXT_PUBLIC_MONGODB_URL;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env.local"
  );
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true
};

const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect()
      .catch(err => {
        console.log("Failed to connect to MongoDB:", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In prod, create a new connection
  clientPromise = client.connect()
    .catch(err => {
      console.log("Failed to connect to MongoDB:", err);
      throw err;
    });
}

export default clientPromise;
