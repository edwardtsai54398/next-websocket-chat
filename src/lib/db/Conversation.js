const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  conversationId: String,
  members: Array,
  conversationName: String,
  timestamp: Number,
});

const Conversation =
  mongoose.models.conversations ||
  mongoose.model("conversations", conversationSchema);

export default Conversation;
