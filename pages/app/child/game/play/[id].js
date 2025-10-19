"use client";
import { getSocket } from "../../../../../utils/socket";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GameBoard from "../../../../../assets/GameBoard.png";
import Image from "next/image";

// Minimal board path for demo
const BOARD_PATH = [
  { id: "go", name: "GO", x: 720, y: 720 },
  { id: "icecream", name: "Ice Cream Truck", x: 560, y: 720 },
  { id: "lostwallet", name: "Lost Wallet", x: 450, y: 720 },
  { id: "bakesale", name: "Bake Sale Stand", x: 340, y: 720 },
];

export default function Game() {
  const { id: lobbyId } = useParams();
  const [socket, setSocket] = useState(null);
  const [currentTile, setCurrentTile] = useState(BOARD_PATH[0]);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");
    const userId = localStorage.getItem("userId");

    // 1️⃣ Fetch game from DB
    fetch(`/api/game/${gameId}?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setGameData(data));

    // 2️⃣ Connect game socket
    socket.current = io("/game"); // could use a namespace or same server
    socket.current.emit("join_game", { gameId, userId });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <div className="relative w-[800px] h-[800px] mx-auto mt-6 overflow-hidden">
      {/* <Image src={GameBoard} alt="Game Board" fill className="object-contain" /> */}

      {/* Player piece */}
      {currentTile && (
        <div
          className="absolute w-8 h-8 bg-green-500 rounded-full"
          style={{
            left: `${currentTile.x_pos}px`,
            top: `${currentTile.y_pos}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
}
