"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LobbyPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("63046610-4264-4ace-a20b-d60633443c9e");
  const [myName, setMyName] = useState("");
  const [currentLobby, setCurrentLobby] = useState(null);
  const [lobbies, setLobbies] = useState([]);

  const API_BASE = "http://localhost:3004";

  // Fetch lobbies from backend
  const fetchLobbies = async () => {
    try {
      const res = await fetch(`${API_BASE}/lobby/all`);
      const data = await res.json();
      console.log(data);
      setLobbies(data.lobbies);
    } catch (err) {
      console.error(err);
      console.log("❌ Failed to fetch lobbies");
    }
  };

  // Poll every 2 seconds
  useEffect(() => {
    fetchLobbies(); // initial fetch
    const interval = setInterval(fetchLobbies, 2000); // every 2s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  // Create lobby
  const createLobby = async () => {
    if (!myName.trim()) return alert("Set your name first!");
    try {
      const res = await fetch(`${API_BASE}/lobby/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: myName }),
      });
      const lobby = await res.json();
      setCurrentLobby(lobby);
      console.log(`✅ Lobby created: ${lobby.id}`);
    } catch (err) {
      console.error(err);
      console.log("❌ Failed to create lobby");
    }
  };

  // Join lobby
  const joinLobby = async (lobbyId) => {
    try {
      await fetch(`${API_BASE}/lobby/${lobbyId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      console.log(`✅ Joined lobby ${lobbyId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to join lobby");
    }
  };

  // Leave lobby
  const leaveLobby = async (lobbyId) => {
    try {
      await fetch(`${API_BASE}/lobby/${lobbyId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      console.log(`❌ Left lobby ${lobbyId}`);
      fetchLobbies(); // refresh the lobby list
    } catch (err) {
      console.error(err);
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
            🎮 Lobby {lobby.id} ({lobby.user_count}/4)
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
