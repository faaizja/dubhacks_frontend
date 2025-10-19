"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../../utils/supabaseClient.js";
import { useRouter } from "next/navigation.js";

export default function LobbyPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("a87ed579-94aa-4d9f-ad5b-6a4e662ef965");
  const [myName, setMyName] = useState("");
  const [currentLobby, setCurrentLobby] = useState(null);
  const [lobbies, setLobbies] = useState([]);

  // Fetch all lobbies with user counts
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
      console.log(formattedLobbies);
      setLobbies(formattedLobbies);
    } catch (err) {
      console.error("❌ Failed to fetch lobbies", err);
    }
  };

  // Poll every 1 second
  useEffect(() => {
    fetchLobbies(); // initial fetch
    const interval = setInterval(fetchLobbies, 1000);
    return () => clearInterval(interval);
  }, []);

  // Create a lobby
  const createLobby = async () => {
    try {
      // Insert a lobby without any name
      const { data: lobbyData, error } = await supabase
        .from("lobbies")
        .insert([{}]) // <- must provide an array with an object
        .select()
        .single();

      if (error) throw error;

      // Add creator as first member
      await supabase
        .from("lobby_members")
        .insert([{ lobby_id: lobbyData.id, user_id: userId }]);

      setCurrentLobby(lobbyData);
      console.log(`✅ Lobby created: ${lobbyData.id}`);
      fetchLobbies();
    } catch (err) {
      console.error("❌ Failed to create lobby", err);
    }
  };

  // Join lobby
  const joinLobby = async (lobbyId) => {
    try {
      await supabase
        .from("lobby_members")
        .insert([{ lobby_id: lobbyId, user_id: userId }]);
      console.log(`✅ Joined lobby ${lobbyId}`);
      router.push(`/app/child/game/${lobbyId}`);
      fetchLobbies();
    } catch (err) {
      console.error("❌ Failed to join lobby", err);
      alert("Failed to join lobby");
    }
  };

  // Leave lobby
  const leaveLobby = async (lobbyId) => {
    try {
      await supabase
        .from("lobby_members")
        .delete()
        .eq("lobby_id", lobbyId)
        .eq("user_id", userId);

      console.log(`❌ Left lobby ${lobbyId}`);
      fetchLobbies();
    } catch (err) {
      console.error("❌ Failed to leave lobby", err);
      alert("Failed to leave lobby");
    }
  };

  return (
    <div>
      <h1>Lobby System</h1>
      <input
        value={myName}
        onChange={(e) => setMyName(e.target.value)}
        placeholder="Your name"
      />
      <button onClick={createLobby}>Create Lobby</button>

      <h2>Available Lobbies</h2>
      {lobbies.map((lobby) => {
        const isMember = lobby.user_ids?.includes(userId);
        return (
          <div key={lobby.id}>
            🎮 Lobby {lobby.name} ({lobby.user_count}/4)
            {!isMember && (
              <button onClick={() => joinLobby(lobby.id)}>Join</button>
            )}
            {isMember && (
              <button onClick={() => leaveLobby(lobby.id)}>Leave</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
