import connectDB from "@/lib/db/connectDB";
import User from "@/lib/db/User";
import { verifyCredential } from "@/lib/credential";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectDB();
    const userCredential = req.headers["user-credential"];
    const userId = req.headers["user-id"];
    try {
      const thisUser = await User.findOne({ userId });
      if (
        await verifyCredential(userCredential, userId, thisUser.loginTimestamp)
      ) {
        thisUser.loginTimestamp = 0;
        await thisUser.save();
        res.status(204).end();
      } else {
        res.status(403).json({
          status: 0,
          errorMessage: "Permission denied",
        });
      }
    } catch {
      res.status(200).json({
        status: 0,
        errorMessage: "User not exist",
      });
    }
  } else {
    res.status(405).json({
      message: `Method ${req.method} Not Allow`,
    });
  }
}
