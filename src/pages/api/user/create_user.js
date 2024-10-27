import { v4 as uuidv4 } from "uuid";
import User from "@/lib/db/User";
import connectDB from "@/lib/db/connectDB";
import moment from "moment";
export default async function handler(req, res) {
  if (req.method === "POST") {
    // 處理 POST 請求，創建或處理資料
    console.log("req", req.body);
    const { userName, displayId } = req.body;
    //先確認displayId有沒有重複，有則回傳錯誤
    await connectDB();
    const allUsers = await User.find()
    if(allUsers.some(user=>user.displayId === displayId)){
      res.status(200).json({
        status: 0,
        errorMessage: "This user id has already exit. Please use another user id."
      })
      return 
    }
    const newUser = new User({
      userName,
      displayId,
      userId: uuidv4(),
      expiredTimestamp: moment().add(30, "days").unix(),
    });
    console.log("newUser", newUser);
    await newUser.save();
    res.status(200).json({
      status: 1,
      result: {
        userName,
        displayId,
        userId: newUser.userId,
        expiredTimestamp: newUser.expiredTimestamp,
      },
      message: "User created!",
    });
  } else {
    res.status(405).json({ errorMessage: `Method ${req.method} Not Allow` });
  }
}
