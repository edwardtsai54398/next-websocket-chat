const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageId: String,
  content: String,
  speaker: String,
  timestamp: Number,
  inConversation: String,
  readUser: Array,
  feedback: String
});
const Message =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

export default Message;
