import { verifyCredential } from "@/lib/credential";
import { NextRequest, NextResponse, NextApiHandler } from "next/server";
import connectDB from "@/lib/db/connectDB";
import User from "@/lib/db/User";

export function withValidation(handler = NextApiHandler, method) {
  return async function (req = NextRequest, res = NextResponse) {
    if (method && req.method !== method) {
      res.status(405).json({
        errorMessage: `Method ${req.method} Not Allow`,
      });
      return;
    }
    if (process.env.NEXT_CONNECT_DB === "false") return handler(req, res);
    await connectDB();
    const userCredential = req.headers["user-crendential"];
    const userId = req.headers["user-id"];

    try {
      const thisUser = await User.findOne({ userId });
      if (
        !(await verifyCredential(
          userCredential,
          userId,
          thisUser.loginTimestamp
        ))
      ) {
        res.status(403).json({
          errorMessage: "Permission denied",
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        errorMessage: error,
      });
      return;
    }

    return handler(req, res);
  };
}
