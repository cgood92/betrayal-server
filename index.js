const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(port, () => console.log(`Server is running on port ${port}`));

const CORS_POLICY = {
  origin: "*",
  methods: ["GET", "POST"],
};

app.use(cors(CORS_POLICY));
const io = require("socket.io")(server, {
  cors: CORS_POLICY,
});

io.sockets.on("error", (e) => console.log(e));

io.sockets.on("connection", (socket) => {
  let broadcaster;

  socket.on("canBroadcast", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("canBroadcast");
  });

  socket.on("canWatch", () => {
    socket.broadcast.emit("canWatch", socket.id);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnectPeer", socket.id);
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });

  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });

  socket.on("broadcastCandidate", (id, message) => {
    socket.to(id).emit("broadcastCandidate", socket.id, message);
  });

  socket.on("watchCandidate", (id, message) => {
    socket.to(id).emit("watchCandidate", socket.id, message);
  });
});
