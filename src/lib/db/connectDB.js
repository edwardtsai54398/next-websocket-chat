// "use server";
import mongoose from "mongoose";
const uri = process.env.DB_URI;

let connectionCache = global.mongoose;
if (!connectionCache) {
  connectionCache = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (connectionCache.conn) {
    console.log("mongoDB already connected");
    return connectionCache.conn;
  }
  if (!connectionCache.promise) {
    console.log("Connected to MongoDB...");
    connectionCache.promise = mongoose
      .connect(uri, {
        dbName: "chatroom",
      })
      .then((mongoose) => {
        console.log("MongoDB connect!!");
        return mongoose;
      });

    connectionCache.conn = await connectionCache.promise;
    return connectionCache.conn;
  }

  const DB = mongoose.connection;
  DB.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
  // console.log("Mongosh!!!");
  // console.log(await mongoose.connection.listCollections());
}

export default connectDB;
