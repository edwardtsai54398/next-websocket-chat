import { withValidation } from "../withValidation";
import Notification from "@/lib/db/Notification";

async function handler(req, res) {
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(204).end();
  } else {
    try {
      const { notifyArray } = req.body;
      console.log(notifyArray);
      console.log(typeof notifyArray);
      console.log(notifyArray.length);

      if (
        notifyArray &&
        typeof notifyArray === "object" &&
        notifyArray.length
      ) {
        await Notification.updateMany(
          { notificationId: { $in: notifyArray } },
          { $set: { isRead: true } }
        );
        res.status(204).end();
      } else {
        res.status(403).json({
          status: 0,
          errorMessage: "Wrong data format",
        });
      }
    } catch (error) {
      console.error("ERROR set_notification_status", error);
    }
  }
}

export default withValidation(handler, "POST");
