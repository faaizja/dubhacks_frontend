"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Game() {
  useEffect(() => {
    const SOCKET_URL = "";

    console.log("🔌 Attempting to connect to:", SOCKET_URL);

    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      extraHeaders: {
        "ngrok-skip-browser-warning": "true", // Add this!
      },
    });

    socket.on("connect", () => {
      console.log("✅ Connected as:", socket.id);
      socket.emit("joinLobby", "myLobby123");
    });

    socket.on("lobbyUpdate", (msg) => {
      console.log("📨 Lobby update:", msg);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
      console.error("Full error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected:", reason);
    });

    return () => {
      console.log("🧹 Cleaning up socket connection");
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Socket.IO Test</h1>
      <p>Check the browser console for connection status</p>
    </div>
  );
}
