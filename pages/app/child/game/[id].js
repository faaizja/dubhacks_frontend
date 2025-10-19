"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import GameBoard from "../../../../assets/GameBoard.png";

// Approximate tile coordinates for an 800x800 board
const BOARD_PATH = [
  { x: 720, y: 720 }, // GO
  { x: 560, y: 720 }, // Ice Cream Truck
  { x: 450, y: 720 }, // Lost Wallet
  { x: 340, y: 720 }, // Bake Sale Stand
  { x: 400, y: 720 }, // Chance
  { x: 320, y: 720 }, // Jail Visiting
  { x: 240, y: 640 }, // Lemonade Stand
  { x: 240, y: 560 }, // Lawn Mowing
  { x: 240, y: 480 }, // Lost Bike
  { x: 240, y: 400 }, // Community Chest
  { x: 240, y: 320 }, // Free Parking
  { x: 320, y: 240 }, // Chance (top)
  { x: 400, y: 240 }, // Tutoring Lessons
  { x: 480, y: 240 }, // Toy Store
  { x: 560, y: 240 }, // School Field Trip
  { x: 640, y: 240 }, // Go To Jail
  { x: 720, y: 320 }, // Save
  { x: 720, y: 400 }, // Community Chest
  { x: 720, y: 480 }, // Chance
  { x: 720, y: 560 }, // Birthday Gift
];


export default function Game() {
  const { id: lobbyId } = useParams();
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    if (!lobbyId) return;
    const SOCKET_URL =
      "https://norris-nondisguised-behavioristically.ngrok-free.dev";
    const socketIo = io(SOCKET_URL, {
      transports: ["websocket"],
      extraHeaders: { "ngrok-skip-browser-warning": "true" },
    });

    setSocket(socketIo);

    socketIo.on("connect", () => {
      console.log("✅ Connected:", socketIo.id);
      socketIo.emit("joinLobby", lobbyId);
    });

    socketIo.on("currentPlayers", (data) => setPlayers(data));

    socketIo.on("newPlayer", (player) => {
      setPlayers((prev) => ({
        ...prev,
        [player.id]: { index: player.index || 0, color: player.color },
      }));
    });

    socketIo.on("playerMoved", ({ id, index }) => {
      setPlayers((prev) => ({ ...prev, [id]: { ...prev[id], index } }));
    });

    socketIo.on("playerDisconnected", (id) => {
      setPlayers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });

    return () => socketIo.disconnect();
  }, [lobbyId]);

  // Move player along the path
  useEffect(() => {
    if (!socket) return;
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        // SPACEBAR to move one step
        setPlayers((prev) => {
          const me = prev[socket.id];
          if (!me) return prev;
          const nextIndex = (me.index + 1) % BOARD_PATH.length;
          socket.emit("move", { index: nextIndex });
          return { ...prev, [socket.id]: { ...me, index: nextIndex } };
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [socket]);

  return (
    <div className="relative w-[800px] h-[800px] border-4 border-black mx-auto mt-6">
      {/* Game Board */}
      <Image
        src={GameBoard}
        alt="Game Board"
        fill
        className="object-contain rounded-xl"
      />

      {/* Players */}
      {Object.entries(players).map(([id, player]) => {
        const tile = BOARD_PATH[player.index || 0];
        return (
          <div
            key={id}
            className="absolute w-8 h-8 rounded-full text-center font-bold text-white shadow-md border-2 border-black"
            style={{
              left: `${tile.x}px`,
              top: `${tile.y}px`,
              backgroundColor: player.color,
              transform: "translate(-50%, -50%)",
            }}
          >
            {id === socket?.id ? "ME" : "P"}
          </div>
        );
      })}
    </div>
  );
}
