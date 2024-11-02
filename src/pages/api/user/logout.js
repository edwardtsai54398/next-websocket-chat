import connectDB from "@/lib/db/connectDB";
import User from "@/lib/db/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectDB();
    const userId = req.headers["user-id"];
    try {
      const thisUser = await User.findOne({ userId });

      thisUser.loginTimestamp = 0;
      await thisUser.save();
      res.status(204).end();
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
