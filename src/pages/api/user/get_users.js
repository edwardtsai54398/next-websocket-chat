import User from "@/lib/db/User";
import connectDB from "@/lib/db/connectDB";
import { withValidation } from "../withValidation";
import Notification from "@/lib/db/Notification";

const fakeData = {
  status: 1,
  result: [
    {
      userId: "d0dccc7d-a48a-485d-bc42-d66009fe5141",
      userName: "三賓",
      displayId: "DaLowYeah_3meow",
      isInvited: false,
    },
    {
      userId: "d0dccc7d-a48a-48sd-bc42-d66009fe5141",
      userName: "驢子",
      displayId: "crank_0398",
      isInvited: false,
    },
  ],
};

async function handler(req, res) {
  console.log(process.env.NEXT_CONNECT_DB);
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(200).json(fakeData);
  } else {
  }
  const userId = req.headers["user-id"];
  const displayId = req.body.displayId;

  try {
    const thisUser = await User.findOne({ userId });
    if (displayId && typeof displayId === "string") {
      const now = Math.floor(Date.now() / 1000);
      let userResult = await User.find({
        displayId: { $regex: displayId, $ne: thisUser.displayId },
        expiredTimestamp: { $gt: now },
      }).lean();
      let userIdArray = userResult.map((user) => user.userId);
      //哪些user有被thisUser發過好友邀請
      let invitedArray = await Notification.find({
        owner: { $in: userIdArray },
        friendInvitation: { $ne: null },
        "friendInvitation.userId": userId,
      }).lean();

      let result = userResult.map((user) => {
        if (invitedArray.length > 0) {
          let userInvitation = invitedArray.find(
            (notifi) => notifi.owner === user.userId
          );
          if (userInvitation) {
            user.isInvited = userInvitation.friendInvitation.isInvited;
            user.isFriend = userInvitation.friendInvitation.isFriend;
          } else {
            user.isInvited = false;
            user.isFriend = false;
          }
        } else {
          user.isInvited = false;
          user.isFriend = false;
        }
        delete user["_id"];
        delete user.expiredTimestamp;
        delete user.loginTimestamp;
        return user;
      });
      res.status(200).json({
        status: 1,
        result,
      });
    } else {
      res.status(400).json({
        status: 0,
        errorMessage: "Wrong data format",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      errorMessage: error,
    });
  }
}

export default withValidation(handler);
