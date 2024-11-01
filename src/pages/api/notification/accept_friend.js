import { withValidation } from "../withValidation";
import Notification from "@/lib/db/Notification";
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
            {notificationId},
            {"friendInvitation.isFriend": true}
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
      res.staus(403).json({
        status: 0,
        errorMessage: "Wrong data format",
      });
    }
  }
}

export default withValidation(handler, "POST");
