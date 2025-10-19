import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const lobbies = {}; // { lobbyId: { socketId: playerData } }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinLobby", (lobbyId, player) => {
    if (!lobbies[lobbyId]) lobbies[lobbyId] = {};
    lobbies[lobbyId][socket.id] = player;
    socket.join(lobbyId);
    io.to(lobbyId).emit("stateUpdate", lobbies[lobbyId]);
  });

  socket.on("movePlayer", ({ dx, dy }) => {
    for (const lobbyId in lobbies) {
      const player = lobbies[lobbyId][socket.id];
      if (player) {
        player.x += dx;
        player.y += dy;
        io.to(lobbyId).emit("stateUpdate", lobbies[lobbyId]);
      }
    }
  });

  socket.on("disconnect", () => {
    for (const lobbyId in lobbies) {
      delete lobbies[lobbyId][socket.id];
      io.to(lobbyId).emit("stateUpdate", lobbies[lobbyId]);
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Server running on port 3001");
});
