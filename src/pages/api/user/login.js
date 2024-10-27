import User from "@/lib/db/User";
import connectDB from "@/lib/db/connectDB";
import { generateCredential } from "@/lib/credential";

export default async function handler(req, res) {
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(200).json({
      status: 1,
      result: {
        credential: "Efrwfkhjih554=+dqa",
        displayId: "doggy_love999",
        userId: "eb481589-eb13-4045-b418-35cc3183f5f5",
        userName: "Hazel",
      },
    });
  } else if (req.method === "POST") {
    await connectDB();
    const timestamp = Math.floor(Date.now() / 1000);
    const { userId } = req.body;
    const thisUser = await User.findOne({ userId });

    if (thisUser.expiredTimestamp <= timestamp) {
      res.status(200).json({
        status: 0,
        result: {},
        errorMessage: "User account has expired",
      });
    } else {
      const credential = await generateCredential(userId, timestamp);
      if (credential) {
        //寫入logintimestamp
        console.log("login timestamp", timestamp);

        thisUser.loginTimestamp = timestamp;
        await thisUser.save();
        res.status(200).json({
          status: 1,
          result: {
            credential,
            displayId: thisUser.displayId,
            userId: thisUser.userId,
            userName: thisUser.userName,
          },
        });
      } else {
        res.status(500).json({
          status: 0,
          result: {},
          errorMessage: "fail to generate credential",
        });
      }
    }
  } else {
    res.status(405).json({
      errorMessage: `Method ${req.method} Not Allow`,
    });
  }
}
