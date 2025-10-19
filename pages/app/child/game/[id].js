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
    <div className="relative w-[800px] h-[800px] border-4 border-black mx-auto mt-6 rounded-xl overflow-hidden">
      {/* Game Board */}
      <Image
        src={GameBoard}
        alt="Game Board"
        fill
        className="object-contain rounded-xl"
      />

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
