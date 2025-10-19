import { io } from "socket.io-client";

const SOCKET_URL =
  "https://norris-nondisguised-behavioristically.ngrok-free.dev";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    });
  }
  return socket;
}
