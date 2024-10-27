import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  notificationId: String,
  friendInvitation: Object,
  owner: String,
  timestamp: Number,
  content: String,
  isRead: Boolean,
});

const Notification =
  mongoose.models.notifications ||
  mongoose.model("notifications", notificationSchema);

export default Notification;
