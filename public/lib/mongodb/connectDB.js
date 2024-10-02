import mongoose from "mongoose";
const mongodbUri =
  "mongodb+srv://donkeycoder:b9DFPZo0yKoZliaE@donkeycoder.gvopa.mongodb.net/?retryWrites=true&w=majority&appName=donkeycoder";
export default async function connectDB() {
  console.log("Connected to MongoDB...");
  const connection = await mongoose.connect(mongodbUri, {
    dbName: "starter",
  });
  const DB = mongoose.connection;
  DB.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
  console.log("Mongosh!!!");
  console.log(await mongoose.connection.listCollections());
}
