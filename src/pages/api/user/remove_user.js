import connectDB from "@/lib/db/connectDB";
import User from "@/lib/db/User";
export default async function handler(req, res){
  if (req.method === "DELETE") {
    const {userId} = req.body
    await connectDB()
    User.deleteOne({userId})
      .then(()=>{
        res.status(204)
      })
      .catch((error)=>{
        res.status(200).json({
          status: 0,
          errorMessage: error
        })
      })
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allow` });
  }
}