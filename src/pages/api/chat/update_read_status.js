import { withValidation } from "../withValidation";
import Message from "@/lib/db/Message";

const handler = async (req, res) => {
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(204).end();
  } else {
    const { conversationId, messageIds } = req.body;
    const userId = req.headers["user-id"];
    if (typeof conversationId === "string" && messageIds.length) {
      try {
        const messages = await Message.find({
          inConversation: req.body.conversationId,
          messageId: { $in: messageIds },
        });
        if (messages.length) {
          await Message.updateMany(
            { inConversation: conversationId, messageId: { $in: messageIds } },
            { $push: { readUser: userId } }
          );
          res.status(204).end();
        } else {
          res.status(404).json({
            status: 0,
            errorMessage: "messages not exists",
          });
        }
      } catch (error) {
        console.error("ERROR update_read_status", error);
      }
    } else {
      res.status(403).json({
        status: 0,
        errorMessage: "Wrong data format",
      });
    }
  }
};

export default withValidation(handler, "POST");
