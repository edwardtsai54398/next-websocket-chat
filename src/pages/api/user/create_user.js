export default function handler(req, res) {
  if (req.method === "POST") {
    // 處理 POST 請求，創建或處理資料
    console.log("req", req.body);
    const { username, displayId } = req.body;
    res.status(200).json({
      result: {
        username,
        displayId,
        userId: "",
        credential: "",
      },
      message: "User created!",
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allow` });
  }
}
