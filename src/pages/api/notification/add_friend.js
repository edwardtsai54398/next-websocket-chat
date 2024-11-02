import User from "@/lib/db/User";
import Notification from "@/lib/db/Notification";
import connectDB from "@/lib/db/connectDB";
import { v4 as uuidv4 } from "uuid";
import { withValidation } from "../withValidation";

async function handler(req, res) {
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(200).json({
      status: 1,
      result: {
        userId: "d0dccc7d-a48a-485d-bc42-d66009fe5141",
        userName: "三賓",
        displayId: "DaLowYeah_3meow",
        isInvited: true,
      },
    });
  } else {
    const { friendId } = req.body;
    if (friendId && typeof friendId === "string") {
      const userId = req.headers["user-id"];
      try {
        const thisUser = await User.findOne({ userId });
        const invitedFriend = await User.findOne({ userId: friendId });
        if(!invitedFriend){
          res.status(400).json({
            status: 0,
            errorMessage: 'FriendId not found'
          })
          return
        }
        //確認發送邀請的人，有沒有已經被對方發好友邀請
        const query = {
          owner: thisUser.userId,
          friendInvitation: { $ne: null },
          "friendInvitation.userId": friendId,
          "friendInvitation.isFriend": false,
        };
        const invitationAlreadyHas = await Notification.findOne(query).lean();
        const now = Math.floor(Date.now() / 1000);
        if (invitationAlreadyHas) {
          //有的話，更改原好友邀請通知的isFreiend為true
          //並且對thisUser寫入一個"已成為某某好友"的通知
          // invitationAlreadyHas.friendInvitation.isFriend = true;
          await Notification.updateOne(query,{"friendInvitation.isFriend": true})
          const newNotificationToThisUser = new Notification({
            notificationId: uuidv4(),
            friendInvitation: null,
            owner: thisUser.userId,
            timestamp: now,
            content: `${invitedFriend.userName} and you are now friends!`,
            isRead: false,
          });
          await newNotificationToThisUser.save();
          //這個frirend也發一個"已成為thisUser好友"的通知
          const newNotificationToFriend = new Notification({
            notificationId: uuidv4(),
            friendInvitation: null,
            owner: invitedFriend.userId,
            timestamp: now,
            content: `${thisUser.userName} and you are now friends!`,
            isRead: false,
          });
          await newNotificationToFriend.save();
          res.status(200).json({
            status: 1,
            result: {
              userId: friendId,
              userName: invitedFriend.userName,
              displayId: invitedFriend.displayId,
              isInvited: true,
              isFriend: true,
            },
          });
        } else {
          //確認friend的好友邀請中，thisUser有沒有已經發過邀請
          const anyInvitationExist = await Notification.find({
            owner: invitedFriend.userId,
            friendInvitation: { $ne: null },
            "friendInvitation.userId": thisUser.userId,
            "friendInvitation.isInvited": true,
          });
          if (anyInvitationExist.length === 0) {
            //直接寫入一個好友邀請
            const invitation = new Notification({
              notificationId: uuidv4(),
              friendInvitation: {
                userId,
                userName: thisUser.userName,
                isInvited: true,
                isFriend: false,
              },
              owner: friendId,
              timestamp: now,
              content: `sent you a friend request.`,
              isRead: false,
            });
            await invitation.save();
            res.status(200).json({
              status: 1,
              result: {
                userId: friendId,
                userName: invitedFriend.userName,
                displayId: invitedFriend.displayId,
                isInvited: true,
                isFriend: false,
              },
            });
          } else {
            //thisUser已經發送過好友邀請，發送錯誤
            res.status(400).json({
              status: 0,
              errorMessage: "You already invited this user as friend.",
            });
          }
        }
      } catch (error) {
        console.log("伺服器錯誤", error);
        res.status(500).json({ errorMessage: error });
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
