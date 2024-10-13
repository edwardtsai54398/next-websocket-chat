import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userId: String,
  displayId: String,
  userName: String,
  expiredTimestamp: Number,
  loginTimestamp: Number,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
