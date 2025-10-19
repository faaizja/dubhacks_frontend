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
  { x: 235, y: 720 }, // Chance
  { x: 140, y: 775 }, // Jail Visiting
  { x: 70, y: 565 }, // Lost Bike
  { x: 70, y: 455 }, // Lawn Mowing
  { x: 70, y: 340 }, // Lemonade Stand
  { x: 70, y: 235 }, // Community Chest
  { x: 70, y: 100 }, // Free Parking
  { x: 235, y: 100 }, // Chance (top)
  { x: 345, y: 100 }, // Tutoring Lessons
  { x: 455, y: 100 }, // Toy Store
  { x: 560, y: 100 }, // School Field Trip
  { x: 720, y: 100 }, // Go To Jail
  { x: 720, y: 235 }, // Save
  { x: 720, y: 345 }, // Community Chest
  { x: 720, y: 455 }, // Chance
  { x: 720, y: 565 }, // Birthday Gift
];

// Cute emoji tokens for each player
const PLAYER_TOKENS = ["👦", "👧", "🐶", "🐱", "🐰", "🐢", "🦊", "🐼"];

export default function Game() {
  const { id: lobbyId } = useParams();
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});
  const [emojiMap, setEmojiMap] = useState({});

  // Connect to Socket.io
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

  // Assign emojis to players dynamically
  useEffect(() => {
    setEmojiMap((prev) => {
      const updated = { ...prev };
      const currentIds = Object.keys(players);
      let used = Object.values(updated);
      currentIds.forEach((id, i) => {
        if (!updated[id]) {
          const nextEmoji =
            PLAYER_TOKENS.find((e) => !used.includes(e)) || "🙂";
          updated[id] = nextEmoji;
          used.push(nextEmoji);
        }
      });
      return updated;
    });
  }, [players]);

  // Move player along the path
  useEffect(() => {
    if (!socket) return;
    const handleKeyDown = (e) => {
      if (e.key === " ") {
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
    <div className="relative w-[800px] h-[800px] mx-auto mt-6 overflow-hidden">
      {/* Game Board */}
      <Image src={GameBoard} alt="Game Board" fill className="object-contain" />

      {/* Players (stacked and animated) */}
      {(() => {
        const groupedByTile = {};
        for (const [id, player] of Object.entries(players)) {
          const tileIndex = player.index || 0;
          if (!groupedByTile[tileIndex]) groupedByTile[tileIndex] = [];
          groupedByTile[tileIndex].push({ id, ...player });
        }

        return Object.entries(groupedByTile).flatMap(([tileIndex, group]) => {
          const tile = BOARD_PATH[tileIndex];
          return group.map((player, i) => (
            <div
              key={player.id}
              className="absolute w-8 h-8 flex items-center justify-center text-2xl font-bold shadow-md border-2 border-black rounded-full transition-all duration-200"
              style={{
                left: `${tile.x + i * 0}px`, // horizontal offset
                top: `${tile.y - i * 40}px`, // vertical offset
                transform: "translate(-50%, -50%)",
                backgroundColor:
                  player.id === socket?.id ? "#22c55e" : player.color,
              }}
            >
              {emojiMap[player.id] || "🙂"}
            </div>
          ));
        });
      })()}
    </div>
  );
}
