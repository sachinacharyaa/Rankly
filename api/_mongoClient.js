const { MongoClient } = require("mongodb");

let client;
let clientPromise;

async function getDb() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "rankly";

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  await clientPromise;
  return client.db(dbName);
}

module.exports = {
  getDb,
};

