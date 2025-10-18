"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Game() {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({}); // { socketId: { x, y, color } }

  useEffect(() => {
    const SOCKET_URL =
      "https://norris-nondisguised-behavioristically.ngrok-free.dev";
    const socketIo = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      extraHeaders: { "ngrok-skip-browser-warning": "true" },
    });

    setSocket(socketIo);

    socketIo.on("connect", () => console.log("✅ Connected as:", socketIo.id));

    // Initial load of current players
    socketIo.on("currentPlayers", (currentPlayers) =>
      setPlayers(currentPlayers)
    );

    // New player joined
    socketIo.on("newPlayer", (player) =>
      setPlayers((prev) => ({
        ...prev,
        [player.id]: { x: player.x, y: player.y, color: player.color },
      }))
    );

    // Player moved
    socketIo.on("playerMoved", ({ id, x, y }) => {
      setPlayers((prev) => ({ ...prev, [id]: { ...prev[id], x, y } }));
    });

    // Player disconnected
    socketIo.on("playerDisconnected", (id) => {
      setPlayers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });

    return () => socketIo.disconnect();
  }, []);

  // Handle WASD movement
  useEffect(() => {
    if (!socket) return;

    const speed = 5;

    const handleKeyDown = (e) => {
      const movement = { dx: 0, dy: 0 };
      if (e.key === "w") movement.dy = -speed;
      if (e.key === "s") movement.dy = speed;
      if (e.key === "a") movement.dx = -speed;
      if (e.key === "d") movement.dx = speed;

      if (movement.dx !== 0 || movement.dy !== 0) {
        socket.emit("move", movement);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [socket]);

  return (
    <div
      style={{
        position: "relative",
        width: "800px",
        height: "600px",
        border: "2px solid black",
        margin: "20px auto",
      }}
    >
      {Object.entries(players).map(([id, player]) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: player.x,
            top: player.y,
            width: "40px",
            height: "40px",
            backgroundColor: player.color,
            borderRadius: "50%",
            textAlign: "center",
            lineHeight: "40px",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {id === socket?.id ? "ME" : "P"}
        </div>
      ))}
    </div>
  );
}
