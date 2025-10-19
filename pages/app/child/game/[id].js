"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

import boat from "../../../../assets/boat.png";
import boot from "../../../../assets/boot.png";
import dog from "../../../../assets/dog.png";
import car from "../../../../assets/car.png";

import ProfileHeader from "../../../../components/sidebar/ProfileHeader";
import BalanceCard from "../../../../components/sidebar/BalanceCard";
import ParentsCard from "../../../../components/sidebar/ParentsCard";
import StatsCard from "../../../../components/sidebar/StatsCard";

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function WaitingRoom() {
  const [dbUserId, setDbUserId] = useState(null); // <-- store user_id here
  const [characters, setCharacters] = useState([
    { id: 1, name: "Boat", image: boat, selected: false, selectedBy: null },
    { id: 2, name: "Boot", image: boot, selected: false, selectedBy: null },
    { id: 3, name: "Car", image: car, selected: false, selectedBy: null },
    { id: 4, name: "Dog", image: dog, selected: false, selectedBy: null },
  ]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const [userData, setUserData] = useState({
    name: "Alex",
    avatar: "👦",
    balance: 125.5,
    parents: ["Mom", "Dad"],
    stats: { choresCompleted: 47, gamesPlayed: 23, streak: 5 },
  });

  // ✅ Fetch lobby and user info
  useEffect(() => {
    const fetchLobby = async () => {
      const { data, error } = await supabase
        .from("lobby_members")
        .select("*")
        .limit(1); // fetch your user; adjust filter if you have a unique way to identify user

      if (error) {
        console.error("Error fetching lobby:", error);
        return;
      }

      if (data && data.length > 0) {
        const userRow = data[0];
        setDbUserId(userRow.user_id); // <-- dynamically set user_id
        setUserData((prev) => ({
          ...prev,
          name: userRow.name || prev.name, // optional: sync with DB
        }));

        // Sync character selection
        setCharacters((prev) =>
          prev.map((char) => {
            const match = data.find(
              (row) => row.character_name === char.name
            );
            return match
              ? {
                  ...char,
                  selected: match.is_selected,
                  selectedBy: match.selected_by,
                }
              : char;
          })
        );
      }
    };

    fetchLobby();

    // ✅ Realtime listener
    const channel = supabase
      .channel("lobby_members_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lobby_members" },
        (payload) => {
          const updated = payload.new;
          setCharacters((prev) =>
            prev.map((char) =>
              char.name === updated.character_name
                ? {
                    ...char,
                    selected: updated.is_selected,
                    selectedBy: updated.selected_by,
                  }
                : char
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Handle selecting a character
  const handleSelectCharacter = async (char) => {
    if (char.selected) return;
    if (selectedCharacterId && selectedCharacterId !== char.id) return;

    setSelectedCharacterId(char.id);
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === char.id
          ? { ...c, selected: true, selectedBy: userData.name }
          : c
      )
    );

    const { error } = await supabase
      .from("lobby_members")
      .update({ is_selected: true, selected_by: userData.name })
      .eq("character_name", char.name);

    if (error) console.error("Error updating character:", error);
  };

  // ✅ Handle Ready button
  const handleReady = async () => {
    if (!dbUserId) return; // ensure user_id is loaded

    const newReady = !isReady;
    setIsReady(newReady);

    const { error } = await supabase
      .from("lobby_members")
      .update({ is_ready: newReady })
      .eq("user_id", dbUserId);

    if (error) console.error("Error updating ready status:", error);
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="w-1/4 bg-[#BDCCBA] h-full p-6 flex flex-col gap-6 overflow-y-auto">
        <ProfileHeader name={userData.name} avatar={userData.avatar} />
        <BalanceCard balance={userData.balance} />
        <ParentsCard parents={userData.parents} />
        <StatsCard stats={userData.stats} />
      </div>

      <div className="w-3/4 relative h-full p-6 bg-[#E8F0E6]">
        <h1 className="mt-6 font-bold text-3xl px-4 text-gray-800">
          Pick your character
        </h1>

        <div className="flex flex-wrap justify-center gap-8 px-4 mt-8">
          {characters.map((c) => (
            <div
              key={c.id}
              className={`p-6 rounded-lg text-center cursor-pointer transition-all border-4 border-black bg-white shadow-lg ${
                c.selected
                  ? "opacity-50 scale-95"
                  : selectedCharacterId === c.id
                  ? "bg-green-200 scale-105"
                  : "hover:scale-105 hover:bg-yellow-100"
              }`}
              onClick={() => handleSelectCharacter(c)}
            >
              <div className="w-32 h-32 relative mx-auto">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 font-bold text-xl">{c.name}</p>
              {c.selectedBy && (
                <p className="text-sm text-gray-700 mt-1">
                  {c.selectedBy === userData.name ? "You" : c.selectedBy}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          className={`mt-12 px-8 py-4 font-bold border-4 border-black rounded-xl text-2xl transition-all shadow-md ${
            isReady
              ? "bg-green-400 hover:bg-green-500"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={handleReady}
        >
          {isReady ? "Ready ✅" : "Ready Up"}
        </button>
      </div>
    </div>
  );
}
