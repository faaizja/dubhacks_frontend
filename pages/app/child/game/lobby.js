// LobbyPage.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "../../../../utils/socket";

export default function LobbyPage() {
  const router = useRouter();
  const [myName, setMyName] = useState("");
  const [currentLobby, setCurrentLobby] = useState(null);
  const [lobbies, setLobbies] = useState([]);
  const [logs, setLogs] = useState([]);
  const socket = getSocket();

  function log(msg) {
    setLogs((prev) => [msg, ...prev]);
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => log(`✅ Connected (${socket.id})`));
    socket.on("lobbies_list", setLobbies);
    socket.on("lobbies_updated", setLobbies);
    socket.on("lobby_created", (lobby) => setCurrentLobby(lobby));
    socket.on("lobby_joined", setCurrentLobby);
    socket.on("user_joined", ({ lobbyId, users }) => {
      setLobbies((prev) =>
        prev.map((l) =>
          l.id === lobbyId ? { ...l, users, userCount: users.length } : l
        )
      );
      if (currentLobby?.id === lobbyId)
        setCurrentLobby((prev) => ({ ...prev, users }));
    });
    socket.on("user_left", ({ lobbyId, users }) => {
      setLobbies((prev) =>
        prev.map((l) =>
          l.id === lobbyId ? { ...l, users, userCount: users.length } : l
        )
      );
      if (currentLobby?.id === lobbyId)
        setCurrentLobby((prev) => ({ ...prev, users }));
    });

    socket.emit("get_lobbies");

    return () => {}; // persistent socket
  }, [socket]);

  const createLobby = () => {
    if (!myName.trim()) return alert("Set your name first!");
    socket.emit("create_lobby", myName);
  };

  const joinLobby = (lobbyId) => {
    if (!myName.trim()) return alert("Set your name first!");
    socket.emit("join_lobby", { lobbyId, userName: myName });
    router.push(
      `/app/child/game/${lobbyId}?name=${encodeURIComponent(
        myName
      )}&id=${lobbyId}`
    );
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
