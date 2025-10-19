"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LobbyPage() {
  const router = useRouter();
  const [myName, setMyName] = useState("");
  const [currentLobby, setCurrentLobby] = useState(null);
  const [lobbies, setLobbies] = useState([]);

  // Fetch lobbies from backend
  const fetchLobbies = async () => {
    try {
      const res = await fetch("http://localhost:3004/lobby/all");
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

  const createLobby = async () => {
    try {
      const res = await fetch("http://localhost:3004/lobby/create", {
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

  const joinLobby = async (lobbyId) => {
    if (!myName.trim()) return alert("Set your name first!");
    try {
      await fetch(`http://localhost:3004/lobby/${lobbyId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      console.log(`✅ Joined lobby ${lobbyId}`);
    } catch (err) {
      console.error(err);
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
      {lobbies.map((lobby) => (
        <div key={lobby.id}>
          🎮 Lobby {lobby.id} ({lobby.userCount}/4)
          <button onClick={() => joinLobby(lobby.id)}>Join</button>
        </div>
      ))}
    </div>
  );
}
