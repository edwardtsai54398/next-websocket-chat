import { verifyCredential } from "@/lib/credential";
import connectDB from "@/lib/db/connectDB";
import User from "@/lib/db/User";
export default async function handler(req, res){
  if (req.method === "DELETE") {
    const {userId} = req.body
    const userCredential = req.headers["user-credential"]
    await connectDB()
    const thisUser = await User.findOne({userId})
    if (await verifyCredential(userCredential, userId, thisUser.loginTimestamp)){
      User.deleteOne({ userId })
        .then(() => {
          res.status(204);
        })
        .catch((error) => {
          res.status(200).json({
            status: 0,
            errorMessage: error,
          });
        });

    }else{
      res.status(403).json({
        status:0,
        errorMessage: "Permssion denied"
      })
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allow` });
  }
}