import { MongoClient } from "mongodb";

const uri= process.env.NEXT_PUBLIC_MONGODB_URI
console.log("connection: ", uri)

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("client: ", client)

let clientPromise;

if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
