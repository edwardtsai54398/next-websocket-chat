import { withValidation } from "../withValidation";
import Message from "@/lib/db/Message";
import Conversation from "@/lib/db/Conversation";
import User from "@/lib/db/User";
import { v4 as uuidv4 } from "uuid";

const handler = async (req, res) => {
  const { conversationId, content, tempId, feedback } = req.body;
  const now = Math.floor(Date.now() / 1000);
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(200).json({
      status: 1,
      result: {
        conversationId,
        content,
        tempId,
        messageId: uuidv4(),
        speakerName: "Hazel",
        speakerId: "eb481589-eb13-4045-b418-35cc3183f5f5",
        timestamp: now,
        feedback: null,
      },
    });
  } else {
    const userId = req.headers["user-id"];
    if (!conversationId || !content || !tempId) {
      res.status(403).json({
        status: 0,
        errorMessage: "Wrong data format",
      });
      return;
    }
    try {
      const conversation = await Conversation.findOne({
        conversationId,
      }).lean();
      if (!conversation) {
        res.status(404).json({
          status: 0,
          errorMessage: "This chatroom doesn't exist",
        });
        return;
      }
      const messageData = {
        messageId: uuidv4(),
        inConversation: conversationId,
        speaker: userId,
        timestamp: now,
        content,
        readUser: [userId],
      };
      let feedbackMessage = null;
      if (feedback) {
        messageData.feedback = feedback;
        feedbackMessage = await Message.findOne({ messageId: feedback }).lean();
        if (!feedbackMessage) {
          res.status(404).json({
            status: 0,
            errorMessage: "Message you commented on doesn't exist",
          });
          return;
        }
        const userFeedbackOn = await User.findOne({
          userId: feedbackMessage.speaker,
        }).lean();
        if (!userFeedbackOn) {
          res.status(404).json({
            status: 0,
            errorMessage: "User you commented on doesn't exist",
          });
        }
        feedbackMessage = {
          messageId: feedbackMessage.messageId,
          content: feedbackMessage.content,
          speakerId: userFeedbackOn.userId,
          speakerName: userFeedbackOn.userName,
        };
      }
      const thisUser = await User.findOne({ userId }).lean();
      console.log("test this userName", thisUser);

      const message = new Message(messageData);
      await message.save();
      await Conversation.updateOne({ conversationId }, { timestamp: now });
      if (feedbackMessage) {
        messageData.feedback = { ...feedbackMessage };
      }
      res.status(200).json({
        status: 1,
        result: {
          conversationId,
          tempId,
          messageId: messageData.messageId,
          content: messageData.content,
          speakerName: thisUser.userName,
          speakerId: userId,
          readUser: messageData.readUser,
          timestamp: now,
          feedback: feedbackMessage,
        },
      });
    } catch (error) {
      console.error("ERROR send_message", error);
    }
  }
};

export default withValidation(handler, "POST");
