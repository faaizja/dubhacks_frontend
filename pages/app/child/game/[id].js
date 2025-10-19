"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/buttons/Button";
import Image from "next/image";

// Import all images
import boat from "../../../../assets/boat.png";
import boot from "../../../../assets/boot.png";
import dog from "../../../../assets/dog.png";
import car from "../../../../assets/car.png";

export default function WaitingRoom() {
  const router = useRouter();
  const userData = {
    name: "Alex",
    avatar: "👦",
    balance: 125.5,
    parents: ["Mom", "Dad"],
    stats: {
      choresCompleted: 47,
      gamesPlayed: 23,
      streak: 5,
    },
  };

  const [characters, setCharacters] = useState([
    { id: 1, name: "Boat", image: boat, selected: false, selectedBy: null },
    { id: 2, name: "Boot", image: boot, selected: false, selectedBy: null },
    { id: 3, name: "Dog", image: dog, selected: false, selectedBy: null },
    { id: 4, name: "Car", image: car, selected: false, selectedBy: null },
  ]);

  const handleSelectCharacter = (selectedCharacter) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === selectedCharacter.id
          ? { ...char, selected: true, selectedBy: userData.name }
          : char
      )
    );
  };

  const handleLobbyClick = (lobby) => {
    if (lobby.status === "open") {
      router.push(`/app/child/game/play/${lobby.id}`);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-[#BDCCBA] h-full p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-white p-6 border-4 border-black ">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl border-4 border-black">
              {userData.avatar}
            </div>
            <h2 className="text-2xl ITC-demi text-gray-800">{userData.name}</h2>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white  p-6 border-4 border-black ">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              My Balance
            </span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl ITC-demi text-green-600">
            ${userData.balance.toFixed(2)}
          </p>
        </div>

        {/* Parents Card */}
        <div className="bg-white  p-6 border-4 border-black ">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👨‍👩‍👦</span>
            <h3 className="text-lg ITC-demi text-gray-800">My Parents</h3>
          </div>
          <div className="flex flex-col gap-2">
            {userData.parents.map((parent, idx) => (
              <div
                key={idx}
                className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
              >
                {parent}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-6 border-4 border-black ">
          <h3 className="text-lg ITC-demi text-gray-800 mb-4">My Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span className="text-sm font-medium text-gray-600">
                  Chores Done
                </span>
              </div>
              <span className="text-xl ITC-demi text-gray-800">
                {userData.stats.choresCompleted}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎮</span>
                <span className="text-sm font-medium text-gray-600">
                  Games Played
                </span>
              </div>
              <span className="text-xl ITC-demi text-gray-800">
                {userData.stats.gamesPlayed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <span className="text-sm font-medium text-gray-600">
                  Day Streak
                </span>
              </div>
              <span className="text-xl ITC-demi text-orange-500">
                {userData.stats.streak}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Character Selection */}
      <div className="w-3/4 fade-in relative h-full p-4">
        <Button
          onClick={() => router.push("/app/child/main")}
          variant="green"
        >
          Back
        </Button>

        <p className="mt-6 ITC-bold text-2xl px-4">Pick your character</p>

        <div className="flex flex-wrap gap-6 px-4 mt-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className="p-6 rounded-lg text-center cursor-pointer"
              onClick={() => handleSelectCharacter(character)}
            >
              <div
                className={`w-32 h-32 relative transition-all duration-300 ${
                  character.selected
                    ? "opacity-50 scale-95"
                    : "hover:scale-105"
                }`}
              >
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 128px) 100vw, 128px"
                />
              </div>
              <p className="text-center mt-2 ITC-demi">{character.name}</p>
              {character.selectedBy && (
                <p className="text-sm text-gray-700">{character.selectedBy}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
