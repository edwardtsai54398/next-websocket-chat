const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const { parse } = require("url");
const { log } = require("node:console");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, port, hostname, customServer: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handler(req, res, parsedUrl);
  });
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // io.emit("update_read_status", "SOCKET CONNECT!!!");
    socket.on("update_read_status", (e) => {
      console.log("UPDATE_READ", e);
      socket.broadcast.emit("update_read_status", e);
      //   io.emit("update_read_status", e);
    });
    socket.on("create_message", (e) => {
      console.log("CREATE_MSG", e);
    });
  });
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
