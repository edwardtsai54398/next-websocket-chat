import { withValidation } from "../withValidation";
import Notification from "@/lib/db/Notification";
import User from "@/lib/db/User";

const fakeData = {
  status: 1,
  result: [
    {
      notificationId: "foi54244soif54-586df-54asd6a4-564asd44d458",
      timestamp: 1730337738,
      content: "Edward and you are now friends!",
      isRead: true,
      friendInvitation: null,
    },
    {
      notificationId: "foijskl54768654-586df-54asd6a4-564asd44d458",
      timestamp: 1730337738,
      content: "sent you a friend request.",
      isRead: false,
      friendInvitation: {
        userId: "6544asd465465a-873d1q2d-64ds-doaijdad46545f",
        userName: "三賓",
        isFriend: false,
      },
    },
    {
      notificationId: "foijskl54soif54-586df-54asd6a4-564asd44d458",
      timestamp: 1730337738,
      content: "sent you a friend request.",
      isRead: true,
      friendInvitation: {
        userId: "6544asoiwf5a-873d1q2d-64ds-doaijdad46545f",
        userName: "Edward",
        isFriend: true,
      },
    },
  ],
};

async function handler(req, res) {
  if (process.env.NEXT_CONNECT_DB === "false") {
    return res.status(200).json(fakeData);
  } else {
    const userId = req.headers["user-id"];
    const notifications = await Notification.find({ owner: userId }).lean();
    let result = [];
    if (notifications.length) {
      result = notifications.map((item) => {
        delete item["_id"];
        delete item["__v"];
        delete item.owner;
        return item;
      });
    }
    res.status(200).json({
      status: 1,
      result,
    });
  }
}

export default withValidation(handler, "GET");
