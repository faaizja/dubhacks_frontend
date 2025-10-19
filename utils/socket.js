// utils/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(
      "https://norris-nondisguised-behavioristically.ngrok-free.dev",
      {
        transports: ["websocket", "polling"],
      }
    );
  }
  return socket;
};
