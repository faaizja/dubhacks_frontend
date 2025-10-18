"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Game() {
  useEffect(() => {

    const socket = io("");

    socket.on("connect", () => {
      console.log("Connected as:", socket.id);

      // Join a lobby
      socket.emit("joinLobby", "myLobby123");
    });

    socket.on("lobbyUpdate", (msg) => {
      console.log("Lobby update:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Check console for lobby updates</div>;
}