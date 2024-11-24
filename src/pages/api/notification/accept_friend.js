import { withValidation } from "../withValidation";
import Notification from "@/lib/db/Notification";
import Conversation from "@/lib/db/Conversation";
import User from "@/lib/db/User";
import { v4 as uuidv4 } from "uuid";

async function handler(req, res) {
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(204).end();
  } else {
    const { notificationId } = req.body;
    if (notificationId && typeof notificationId === "string") {
      try {
        const notification = await Notification.findOne({
          notificationId,
        }).lean();
        if (notification && notification.friendInvitation) {
          await Notification.updateOne(
            { notificationId },
            { "friendInvitation.isFriend": true }
          );
          const responseUser = await User.findOne({
            userId: notification.owner,
          });
          const now = Math.floor(Date.now() / 1000);
          const newNotification = new Notification({
            notificationId: uuidv4(),
            friendInvitation: null,
            owner: notification.friendInvitation.userId,
            timestamp: now,
            content: `${responseUser.userName} and you are now friends!`,
            isRead: false,
          });
          await newNotification.save();
          //找出members有thisUser和friend，，並且member只有這兩個人
          //並且thisUser的Access為false的Conversation
          const conversationQuery = {
            $and: [
              {
                members: {
                  $all: [
                    {
                      $elemMatch: {
                        userId: responseUser.userId,
                        canAccess: false,
                      },
                    },
                    {
                      $elemMatch: {
                        userId: notification.friendInvitation.userId,
                      },
                    },
                  ],
                },
              },
              {
                members: { $size: 2 },
              },
            ],
          };
          const conversation = await Conversation.find(
            conversationQuery
          ).lean();
          if (conversation && conversation.length === 1) {
            const updateConversation = await Conversation.updateOne(
              conversationQuery,
              {
                $set: {
                  "members.$[elem].canAccess": true,
                  timestamp: now,
                },
              },
              {
                arrayFilters: [
                  { "elem.userId": responseUser.userId }, // 選擇要更新的陣列元素
                ],
              }
            );
          }
          res.status(204).end();
        } else {
          res.status(400).json({
            status: 0,
            errorMessage: "Cannot find this notification.",
          });
        }
      } catch (error) {
        console.error("ERROR accept_friend", error);
      }
    } else {
      res.status(403).json({
        status: 0,
        errorMessage: "Wrong data format",
      });
    }
  }
}

export default withValidation(handler, "POST");
