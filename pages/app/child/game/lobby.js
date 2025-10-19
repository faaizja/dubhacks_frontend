"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../../utils/supabaseClient.js";
import { useRouter } from "next/navigation.js";
import ProfileHeader from "../../../../components/sidebar/ProfileHeader.js";
import BalanceCard from "../../../../components/sidebar/BalanceCard.js";
import ParentsCard from "../../../../components/sidebar/ParentsCard.js";
import StatsCard from "../../../../components/sidebar/StatsCard.js";
import LobbyCard from "../../../../components/LobbyCard";
import { Button } from "../../../../components/buttons/Button";

export default function LobbyPage() {
  const router = useRouter();
  const [userId] = useState("a87ed579-94aa-4d9f-ad5b-6a4e662ef965");
  const [lobbies, setLobbies] = useState([]);

  // Fetch all lobbies with member data
  const fetchLobbies = async () => {
    try {
      const { data, error } = await supabase.from("lobbies").select(`
        id,
        lobby_members!fk_lobby (
          user_id
        )
      `);

      if (error) throw error;

      const formattedLobbies = data.map((lobby) => ({
        ...lobby,
        user_ids: lobby.lobby_members.map((m) => m.user_id),
        user_count: lobby.lobby_members.length,
      }));

      setLobbies(formattedLobbies);
    } catch (err) {
      console.error("❌ Failed to fetch lobbies", err);
    }
  };

  // Poll every second
  useEffect(() => {
    fetchLobbies();
    const interval = setInterval(fetchLobbies, 1000);
    return () => clearInterval(interval);
  }, []);

  // Create a new lobby
  const createLobby = async () => {
    try {
      const { data: lobbyData, error } = await supabase
        .from("lobbies")
        .insert([{}])
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from("lobby_members")
        .insert([{ lobby_id: lobbyData.id, user_id: userId }]);

      console.log(`✅ Lobby created: ${lobbyData.id}`);
      fetchLobbies();
    } catch (err) {
      console.error("❌ Failed to create lobby", err);
    }
  };

  // Join lobby then redirect
  const joinLobby = async (lobbyId) => {
    try {
      await supabase
        .from("lobby_members")
        .insert([{ lobby_id: lobbyId, user_id: userId }]);

      console.log(`✅ Joined lobby ${lobbyId}`);
      router.push(`/app/child/game/${lobbyId}`);
    } catch (err) {
      console.error("❌ Failed to join lobby", err);
      alert("Failed to join lobby");
    }
  };

  // Handle clicking a lobby card
  const handleLobbyClick = (lobby) => {
    const isMember = lobby.user_ids?.includes(userId);
    const isFull = lobby.user_count >= 4;

    if (isMember) {
      // 👇 Already a member → go straight to game page
      router.push(`/app/child/game/${lobby.id}`);
    } else if (!isFull) {
      // 👇 Not a member → join first, then go
      joinLobby(lobby.id);
    } else {
      alert("Lobby is full!");
    }
  };

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

  // Format lobbies for display
  const getFormattedLobbies = () => {
    return lobbies.map((lobby, index) => {
      const isMember = lobby.user_ids?.includes(userId);
      const isFull = lobby.user_count >= 4;

      let status;
      if (isFull) status = "full";
      else if (isMember) status = "ongoing";
      else status = "open";

      return {
        id: lobby.id,
        status,
        playerCount: lobby.user_count,
        isMember,
        lobbyNum: index + 1,
      };
    });
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#BDCCBA] h-full p-6 flex flex-col gap-6 overflow-y-auto">
        <ProfileHeader name={userData.name} avatar={userData.avatar} />
        <BalanceCard balance={userData.balance} />
        <ParentsCard parents={userData.parents} />
        <StatsCard stats={userData.stats} />
      </div>

      {/* Main Content */}
      <div className="w-3/4 fade-in h-full p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => router.push("/app/child/main")}
            variant="green"
          >
            Back
          </Button>
          <Button onClick={createLobby} variant="blue">
            Create New Lobby
          </Button>
        </div>

        <h2 className="text-2xl ITC-demi mb-4">Available Lobbies</h2>

        <div className="flex flex-wrap gap-4">
          {getFormattedLobbies().map((lobby) => (
            <LobbyCard
              key={lobby.id}
              lobbyNum={lobby.lobbyNum}
              lobby={lobby}
              onClick={() => handleLobbyClick(lobby)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
