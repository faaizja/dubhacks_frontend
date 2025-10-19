"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getSocket } from "../../../../utils/socket";

import boat from "../../../../assets/boat.png";
import boot from "../../../../assets/boot.png";
import dog from "../../../../assets/dog.png";
import car from "../../../../assets/car.png";

export default function WaitingRoom() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lobbyId = searchParams.get("id") || searchParams.get("lobbyId");
  const userName = searchParams.get("name");
  const socket = getSocket();
  const [isReady, setIsReady] = useState(false);

  // ✅ Hardcoded DB User ID for now
  const dbUserId = "63046610-4264-4ace-a20b-d60633443c9e";

  const handleReady = () => {
    if (!characters.find((c) => c.selectedBy === userName)) {
      alert("You must select a character first!");
      return;
    }
    setIsReady(true);
    socket.emit("user_ready", { lobbyId, dbUserId });
  };

  const [players, setPlayers] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [characters, setCharacters] = useState([
    { id: 1, name: "Boat", image: boat, selected: false, selectedBy: null },
    { id: 2, name: "Boot", image: boot, selected: false, selectedBy: null },
    { id: 3, name: "Dog", image: dog, selected: false, selectedBy: null },
    { id: 4, name: "Car", image: car, selected: false, selectedBy: null },
  ]);

  useEffect(() => {
    if (!lobbyId || !userName) return;

    const updatePlayers = (lobby) => setPlayers(lobby.users || []);
    const handleUserJoined = ({ lobbyId: lId, users }) =>
      lId === lobbyId && setPlayers(users);
    const handleUserLeft = ({ lobbyId: lId, users }) =>
      lId === lobbyId && setPlayers(users);

    const handleCharacterSelected = ({ charId, selectedBy }) => {
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === charId ? { ...c, selected: true, selectedBy } : c
        )
      );
    };

    const handleCharacterDeselected = ({ charId }) => {
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === charId ? { ...c, selected: false, selectedBy: null } : c
        )
      );
    };

    // ✅ Join the lobby with dbUserId
    socket.emit("join_lobby", { lobbyId, userName, dbUserId });

    // Fetch current lobby data
    socket.emit("get_lobby", lobbyId);

    // Listen for events
    socket.on("lobby_data", (lobby) => {
      updatePlayers(lobby);
      if (lobby.characters) setCharacters(lobby.characters);
    });
    socket.on("lobby_joined", (lobby) => {
      updatePlayers(lobby);
      if (lobby.characters) setCharacters(lobby.characters);
    });
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);
    socket.on("character_selected", handleCharacterSelected);
    socket.on("character_deselected", handleCharacterDeselected);

    socket.on("game_started", ({ gameId, gameMembers, tiles }) => {
      console.log(`game would start ${gameId} + ${gameMembers} + ${tiles}`);
    });

    return () => {
      socket.off("lobby_data", updatePlayers);
      socket.off("lobby_joined", updatePlayers);
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);
      socket.off("character_selected", handleCharacterSelected);
      socket.off("character_deselected", handleCharacterDeselected);
      socket.off("game_started");
      socket.emit("leave_lobby", lobbyId);
    };
  }, [lobbyId, userName, socket]);

  const handleSelectCharacter = (char) => {
    if (char.selected) return;

    if (selectedCharacterId) return;

    setSelectedCharacterId(char.id);

    // ✅ Send event to server with dbUserId
    socket.emit("select_character", {
      lobbyId,
      charId: char.id,
      selectedBy: userName,
    });
  };

  return (
    <div className="flex h-screen w-screen">
      {/* --- Sidebar: Players --- */}
      <div className="w-1/4 bg-gray-200 h-full p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="bg-white p-6 border-4 border-black flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl border-4 border-black">
            👦
          </div>
          <h2 className="text-2xl font-bold">{userName}</h2>
        </div>

        <div className="bg-white p-6 border-4 border-black">
          <h3 className="text-lg font-bold mb-2">Players in Lobby</h3>
          <ul>
            {players.length === 0 && <li>No players yet</li>}
            {players.map((player) => (
              <li key={player.id}>
                {player.name} {player.name === userName ? "(YOU)" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Main: Character selection --- */}
      <div className="w-3/4 relative h-full p-4">
        <p className="mt-6 font-bold text-2xl px-4">Pick your character</p>
        <div className="flex flex-wrap gap-6 px-4 mt-4">
          {characters.map((c) => (
            <div
              key={c.id}
              className={`p-6 rounded-lg text-center cursor-pointer border-2 border-black transition-all ${
                c.selected
                  ? "opacity-50 scale-95"
                  : selectedCharacterId === c.id
                  ? "bg-green-200 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => handleSelectCharacter(c)}
            >
              <div className="w-32 h-32 relative">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 font-bold">{c.name}</p>
              {c.selectedBy && (
                <p className="text-sm text-gray-700">
                  {c.selectedBy === userName ? "You" : c.selectedBy}
                </p>
              )}
            </div>
          ))}
        </div>
        <button
          className={`mt-4 px-4 py-2 font-bold border-2 border-black rounded ${
            isReady ? "bg-green-400" : "bg-gray-200"
          }`}
          onClick={handleReady}
        >
          {isReady ? "Ready ✅" : "Ready"}
        </button>
      </div>
    </div>
  );
}
