import WebSocket from "ws";

export default async function handler(req, res) {
  const wsServer = new WebSocket.Server({ noServer: true });
  wsServer.on("connection", () => {
    wsServer.on("message", (message) => {
      console.log("received: %s", message);
    });
  });

  if (!res.writableEnded) {
    res.writeHead(101, {
      "Content-Type": "text/plain",
      Connection: "Upgrade",
      Upgrade: "websocket",
    });
    res.end();
  }

  wsServer.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    wsServer.emit("connection", ws, req);
    console.log("server side websocket CONNECTED!!");
  });
}
