const mongoose = require("mongoose");
const Message = mongoose.model(
  "messages",
  new mongoose.Schema({
    message: String,
    speaker: String,
    timestamp: Number,
    conversationId: String,
    readedByCustomerId: String,
    // replyOnMessage: String,
    // replyOnSpeaker: String
  })
);

export default Message