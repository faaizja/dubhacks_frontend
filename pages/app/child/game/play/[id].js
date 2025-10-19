"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import GameBoard from "../../../../../assets/GameBoard.png";

// Board path
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

const PLAYER_TOKENS = ["👦", "👧", "🐶", "🐱", "🐰", "🐢", "🦊", "🐼"];

// Define interactive tiles
const INTERACTIVE_TILES = {
  1: { title: "Ice Cream Truck", options: ["Buy Ice Cream", "Skip"] },
  2: { title: "Lost Wallet", options: ["Pick Up Wallet", "Ignore"] },
  3: { title: "Bake Sale Stand", options: ["Buy Cake", "Skip"] },
  7: { title: "Lawn Mowing", options: ["Mow Lawn", "Skip"] },
};

export default function Game() {
  const { id: lobbyId } = useParams();
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});
  const [emojiMap, setEmojiMap] = useState({});
  const [modal, setModal] = useState({ open: false, tile: null });
  const [currentTurn, setCurrentTurn] = useState(null);

  // Connect to Socket.io
  useEffect(() => {
    if (!lobbyId) return;
    const socketIo = io(
      "https://norris-nondisguised-behavioristically.ngrok-free.dev",
      {
        transports: ["websocket"],
        extraHeaders: { "ngrok-skip-browser-warning": "true" },
      }
    );
    setSocket(socketIo);

    socketIo.on("connect", () => {
      console.log("✅ Connected:", socketIo.id);
      socketIo.emit("joinLobby", lobbyId);
    });

    socketIo.on("currentPlayers", (data) => setPlayers(data));
    socketIo.on("newPlayer", (player) =>
      setPlayers((prev) => ({
        ...prev,
        [player.id]: { index: player.index || 0, color: player.color },
      }))
    );
    socketIo.on("playerMoved", ({ id, index }) =>
      setPlayers((prev) => ({ ...prev, [id]: { ...prev[id], index } }))
    );
    socketIo.on("playerDisconnected", (id) =>
      setPlayers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      })
    );
    socketIo.on("currentTurn", (playerId) => setCurrentTurn(playerId));
    socketIo.on("playerAction", ({ playerId, action }) => {
      console.log(`Player ${playerId} action:`, action);
    });

    return () => socketIo.disconnect();
  }, [lobbyId]);

  // Assign emojis
  useEffect(() => {
    setEmojiMap((prev) => {
      const updated = { ...prev };
      const currentIds = Object.keys(players);
      let used = Object.values(updated);
      currentIds.forEach((id) => {
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

  // Handle keypress for moving (only if player's turn)
  // Handle keypress for moving (only if player's turn AND no modal is open)
  useEffect(() => {
    if (!socket) return;
    const handleKeyDown = (e) => {
      if (socket.id !== currentTurn) return; // Block all non-current players
      if (modal.open) return; // Block movement while modal is open

      if (e.key === " ") {
        setPlayers((prev) => {
          const me = prev[socket.id];
          if (!me) return prev;
          const nextIndex = (me.index + 1) % BOARD_PATH.length;
          socket.emit("move", { index: nextIndex });

          // Open modal if interactive tile
          if (INTERACTIVE_TILES[nextIndex]) {
            // Broadcast modal info to all clients
            setModal({ open: true, tile: INTERACTIVE_TILES[nextIndex] });
            socket.emit("modalOpened", nextIndex); // optional if server needs to track
          }

          return { ...prev, [socket.id]: { ...me, index: nextIndex } };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [socket, currentTurn, modal.open]);

  const handleModalAction = (action) => {
    if (socket.id !== currentTurn) return; // safety
    socket.emit("modalAction", action);
    setModal({ open: false, tile: null }); // close modal for everyone
  };

  return (
    <div className="relative w-[800px] h-[800px] mx-auto mt-6 overflow-hidden">
      <Image src={GameBoard} alt="Game Board" fill className="object-contain" />

      {/* Players */}
      {/* Players */}
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
                left: `${tile.x + i * 20}px`, // small horizontal offset
                top: `${tile.y - i * 20}px`, // vertical stacking
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

      {/* Modal */}
      {modal.open && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">{modal.tile.title}</h2>
            <p className="mb-4">
              {socket.id === currentTurn
                ? "Your turn!"
                : `Waiting for ${emojiMap[currentTurn] || "player"}...`}
            </p>
            <div className="flex flex-col gap-2">
              {modal.tile.options.map((option) => (
                <button
                  key={option}
                  disabled={socket.id !== currentTurn} // only current player can click
                  onClick={() => handleModalAction(option)}
                  className={`py-2 rounded text-white transition ${
                    socket.id === currentTurn
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}