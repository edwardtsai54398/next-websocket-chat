import User from "@/lib/db/User";
import connectDB from "@/lib/db/connectDB";
import { generateCredential } from "@/lib/credential";

export default function handler(req, res) {
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
  }
}