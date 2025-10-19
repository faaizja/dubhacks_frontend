// src/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL =
  "https://norris-nondisguised-behavioristically.ngrok-free.dev";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // faster + fewer disconnects
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: false,
});
