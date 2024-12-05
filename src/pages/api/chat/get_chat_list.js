import { withValidation } from "../withValidation";
import Conversation from "@/lib/db/Conversation.js";
import Message from "@/lib/db/Message.js";
import User from "@/lib/db/User.js";

const fakeData = {
  status: 1,
  result: [
    {
      conversationId: "533b6b2a-189d-41ab-bda7-c8a5c3592abd",
      conversationName: "Edward",
      latestContent: "And you?",
      timestamp: 1727840465,
      unreadTotal: 2,
      latestMessages: [
        {
          messageId: "9cdf308e-fcea-4a34-995e-42f64f42e34e",
          content: "How are you today ?",
          speakerName: "Hazel",
          speakerId: "eb481589-eb13-4045-b418-35cc3183f5f5",
          timestamp: 1727834400,
          readUser: [
            "eb481589-eb13-4045-b418-35cc3183f5f5",
            "3ff7fcf7-7f25-4026-bf87-27a92bc05685",
          ],
        },
        {
          messageId: "5a58400d-1799-4ca1-9f11-149ea13dee92",
          content: "I' fine, Thank you~",
          speakerName: "Edward",
          speakerId: "3ff7fcf7-7f25-4026-bf87-27a92bc05685",
          timestamp: 1727840465,
          readUser: ["3ff7fcf7-7f25-4026-bf87-27a92bc05685"],
          feedback: {
            messageId: "9cdf308e-fcea-4a34-995e-42f64f42e34e",
            content: "How are you today ?",
            speakerName: "Hazel",
            speakerId: "eb481589-eb13-4045-b418-35cc3183f5f5",
          },
        },
        {
          messageId: "10aadc8d-af6d-4696-9ba2-fe79831d2e92",
          content: "And you?",
          speakerName: "Edward",
          speakerId: "3ff7fcf7-7f25-4026-bf87-27a92bc05685",
          timestamp: 1727840470,
          readUser: ["3ff7fcf7-7f25-4026-bf87-27a92bc05685"],
        },
      ],
    },
  ],
};

const handler = async (req, res) => {
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(200).json(fakeData);
  } else {
    try {
      const userId = req.headers["user-id"];
      const allChatsSorted = await Conversation.find({
        members: {
          $elemMatch: { userId, canAccess: true },
        },
      })
        .sort({ timestamp: -1 })
        .lean();

      let chatsResponse = [...allChatsSorted];
      if (req.body?.oldestConversationId) {
        let index = allChatsSorted.findIndex(
          (item) => item._id === req.body.oldestConversationId
        );
        chatsResponse = allChatsSorted
          .filter((item, i) => i > index)
          .filter((item, i) => i < 20);
      }

      let result = await Promise.all(
        chatsResponse.map(async (item) => {
          let latestMessages = await Message.find({
            inConversation: item.conversationId,
          })
            .sort({ timestamp: -1 })
            .limit(50)
            .lean();

          let members = await User.find({
            userId: { $in: item.members.map((m) => m.userId) },
          }).lean();

          let conversationName = item.conversationName;
          if (
            typeof item.conversationName !== "string" ||
            item.conversationName === ""
          ) {
            conversationName = members.find(
              (m) => m.userId !== userId
            ).userName;
          }
          let unreadTotal = latestMessages.filter(
            (m) => !m.readUser.some((id) => userId === id)
          ).length;
          latestMessages.reverse();
          let latestMessagesFormatted = await Promise.all(
            latestMessages.map(async (message) => {
              let speakerName = members.find(
                (m) => m.userId === message.speaker
              ).userName;
              let feedbackContent = null;
              if (message.feedback) {
                let feedbackMsg = latestMessages.find(
                  (m) => m.messageId === message.feedback
                );
                if (!feedbackMsg) {
                  //feedback 不在前50訊息
                  feedbackMsg = await Message.find({
                    messageId: message.feedback.messageId,
                  });
                }
                feedbackContent = {
                  content: feedbackMsg.content,
                  speakerId: feedbackMsg.speaker,
                  speakerName: members.find(
                    (m) => m.userId === feedbackMsg.speaker
                  ).userName,
                  messageId: feedbackMsg.messageId,
                };
              }
              return {
                messageId: message.messageId,
                content: message.content,
                speakerId: message.speaker,
                speakerName,
                timestamp: message.timestamp,
                readUser: message.readUser,
                feedback: feedbackContent,
              };
            })
          );
          const latestContent = latestMessagesFormatted.length
            ? latestMessagesFormatted[latestMessagesFormatted.length - 1]
                .content
            : "";

          return {
            conversationId: item.conversationId,
            conversationName,
            latestContent,
            timestamp: item.timestamp,
            unreadTotal,
            latestMessages: latestMessagesFormatted,
          };
        })
      );

      res.status(200).json({
        status: 1,
        result,
      });
    } catch (error) {
      console.error("ERROR get_chat_list", error);
      res.status(500).json({
        errorMessage: error,
      });
    }
  }
};

export default withValidation(handler, "POST");
