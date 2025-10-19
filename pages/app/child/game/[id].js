"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../../../../components/buttons/Button";
import Image from "next/image";

import boat from "../../../../assets/boat.png";
import boot from "../../../../assets/boot.png";
import dog from "../../../../assets/dog.png";
import car from "../../../../assets/car.png";

import { getSocket } from "../../../../utils/socket";

export default function WaitingRoom() {
  const searchParams = useSearchParams();
  const lobbyId = searchParams.get("id") || searchParams.get("lobbyId");
  const userName = searchParams.get("name");

  const [players, setPlayers] = useState([]);
  const [characters, setCharacters] = useState([
    { id: 1, name: "Boat", image: boat, selected: false, selectedBy: null },
    { id: 2, name: "Boot", image: boot, selected: false, selectedBy: null },
    { id: 3, name: "Dog", image: dog, selected: false, selectedBy: null },
    { id: 4, name: "Car", image: car, selected: false, selectedBy: null },
  ]);

  const socket = getSocket();

  useEffect(() => {
    if (!lobbyId || !userName) return;

    socket.emit("join_lobby", { lobbyId, userName });
    socket.emit("get_lobby", lobbyId);

    socket.on("lobby_data", (lobby) => setPlayers(lobby.users));
    socket.on("lobby_joined", (lobby) => setPlayers(lobby.users));
    socket.on("user_joined", (data) => {
      if (data.lobbyId === lobbyId) setPlayers(data.users);
    });
    socket.on("user_left", (data) => {
      if (data.lobbyId === lobbyId) setPlayers(data.users);
    });

    socket.on("character_selected", ({ charId, selectedBy }) => {
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === charId ? { ...c, selected: true, selectedBy } : c
        )
      );
    });

    return () => {
      socket.emit("leave_lobby", lobbyId);
      // Do NOT disconnect; socket is persistent
    };
  }, [lobbyId, userName]);

  const handleSelectCharacter = (char) => {
    if (char.selected) return;
    socket.emit("select_character", {
      lobbyId,
      charId: char.id,
      selectedBy: userName,
    });
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="w-1/4 bg-[#BDCCBA] h-full p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="bg-white p-6 border-4 border-black flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl border-4 border-black">
            👦
          </div>
          <h2 className="text-2xl ITC-demi text-gray-800">{userName}</h2>
        </div>

        <div className="bg-white p-6 border-4 border-black">
          <h3 className="text-lg ITC-demi text-gray-800 mb-2">
            Players in Lobby
          </h3>
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.name} {player.name === userName ? "(YOU)" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-3/4 relative h-full p-4">
        <Button variant="green">Back</Button>
        <p className="mt-6 ITC-bold text-2xl px-4">Pick your character</p>
        <div className="flex flex-wrap gap-6 px-4 mt-4">
          {characters.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-lg text-center cursor-pointer"
              onClick={() => handleSelectCharacter(c)}
            >
              <div
                className={`w-32 h-32 relative transition-all duration-300 ${
                  c.selected ? "opacity-50 scale-95" : "hover:scale-105"
                }`}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 ITC-demi">{c.name}</p>
              {c.selectedBy && (
                <p className="text-sm text-gray-700">{c.selectedBy}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
