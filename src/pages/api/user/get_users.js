import User from "@/lib/db/User";
import connectDB from "@/lib/db/connectDB";
import { verifyCredential } from "@/lib/credential";
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

export default async function handler(req, res) {
  console.log(process.env.NEXT_CONNECT_DB);
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(200).json(fakeData);
  } else if (req.method === "POST") {
    await connectDB();
    const userCredential = req.headers["user-crendential"];
    const userId = req.headers["user-id"];
    const displayId = req.body.displayId;

    try {
      const thisUser = await User.findOne({ userId });
      if (
        await verifyCredential(userCredential, userId, thisUser.loginTimestamp)
      ) {
        if (displayId && typeof displayId === "string") {
          const now = Math.floor(Date.now() / 1000);
          let userResult = await User.find({
            displayId: { $regex: displayId },
            expiredTimestamp: { $gt: now },
          }).lean();
          let userIdArray = userResult.map((user) => user.userId);
          let mightInvitedArray = await Notification.find({
            owner: { $in: userIdArray },
            friendInvitation: { $ne: null },
          });
          console.log("mightInvitedArray", mightInvitedArray);

          let result = userResult.map((user) => {
            let userNotifiArray = mightInvitedArray.filter(
              (item) => item.owner === user.userId
            );
            console.log("userNotifiArray", userNotifiArray);
            if (userNotifiArray.length > 0) {
              let userInvitation = userNotifiArray.find(
                (item) => item.friendInvitation.userId === thisUser.userId
              );
              console.log("userInvitation", userInvitation);
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
      } else {
        res.status(403).json({
          status: 0,
          errorMessage: "Permission denied",
        });
      }
    } catch (error) {
      res.status(404).json({
        status: 0,
        errorMessage: error,
      });
    }
  } else {
    res.status(405).json({
      status: 0,
      errorMessage: `Method ${req.method} Not Allow`,
    });
  }
}
