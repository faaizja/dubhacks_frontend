"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSocket } from "../../../../utils/socket";

export default function LobbyPage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [myName, setMyName] = useState("");
  const [currentLobby, setCurrentLobby] = useState(null);
  const [lobbies, setLobbies] = useState([]);
  const [logs, setLogs] = useState([]);

  const socket = getSocket();

  function log(message, type = "info") {
    setLogs((prev) => [
      { message, type, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  }

  function logColor(type) {
    switch (type) {
      case "success":
        return "#2ecc71";
      case "error":
        return "#e74c3c";
      case "info":
        return "#3498db";
      default:
        return "#eee";
    }
  }

  useEffect(() => {
    if (!socket) return;

    // Connection events
    socket.on("connect", () => {
      setIsConnected(true);
      log(`✅ Connected (${socket.id})`, "success");
      socket.emit("get_lobbies");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      log("⚠️ Disconnected", "error");
    });

    // Lobby events
    socket.on("lobbies_list", (data) => {
      log(`Received ${data.length} lobbies`, "info");
      setLobbies(data);
    });

    socket.on("lobbies_updated", (data) => setLobbies(data));

    socket.on("lobby_created", (lobby) => {
      log(`✅ Lobby created: ${lobby.id}`, "success");
      setCurrentLobby(lobby);
      setLobbies((prev) => [...prev, lobby]);
    });

    socket.on("lobby_joined", (lobby) => {
      log(`✅ Joined lobby: ${lobby.id}`, "success");
      setCurrentLobby(lobby);
    });

    socket.on("user_joined", (data) => {
      if (currentLobby && data.lobbyId === currentLobby.id) {
        const updatedLobby = { ...currentLobby, users: data.users };
        setCurrentLobby(updatedLobby);
        setLobbies((prev) =>
          prev.map((l) => (l.id === updatedLobby.id ? updatedLobby : l))
        );
      }
    });

    socket.on("user_left", (data) => {
      if (currentLobby && data.lobbyId === currentLobby.id) {
        const updatedLobby = { ...currentLobby, users: data.users };
        setCurrentLobby(updatedLobby);
        setLobbies((prev) =>
          prev.map((l) => (l.id === updatedLobby.id ? updatedLobby : l))
        );
      }
    });

    socket.on("error", (err) => {
      log(`❌ Error: ${err.message}`, "error");
      alert(err.message);
    });

    return () => {
      // DO NOT disconnect socket; it's persistent
    };
  }, [socket, currentLobby]);

  // Handlers
  const setNameHandler = () => {
    if (!myName.trim()) return alert("Please enter a name");
    log(`Name set to: ${myName}`, "success");
  };

  const createLobby = () => {
    if (!myName.trim()) return alert("Set your name first!");
    log(`Creating lobby as ${myName}...`, "info");
    socket.emit("create_lobby", myName);
  };

  const joinLobby = (lobbyId) => {
    if (!myName.trim()) return alert("Set your name first!");
    log(`Joining lobby ${lobbyId}...`, "info");
    socket.emit("join_lobby", { lobbyId, userName: myName });
    router.push(
      `/app/child/game/${lobbyId}?name=${encodeURIComponent(myName)}`
    );
  };

  const leaveLobby = () => {
    if (!currentLobby?.id) return;
    socket.emit("leave_lobby", currentLobby.id);
    setCurrentLobby(null);
  };

  const getLobbies = () => socket.emit("get_lobbies");
  const clearLogs = () => setLogs([]);

  return (
    <div className="container">
      <h1>🎮 Lobby System</h1>
      <div className={isConnected ? "connected" : "disconnected"}>
        {isConnected ? `✅ Connected (${socket?.id})` : "⚠️ Disconnected"}
      </div>

      {/* User Info */}
      <div className="section">
        <h2>Your Info</h2>
        <input
          value={myName}
          onChange={(e) => setMyName(e.target.value)}
          placeholder="Enter your name"
        />
        <button onClick={setNameHandler}>Set Name</button>
        {myName && <p style={{ color: "#3498db" }}>✅ Name set to: {myName}</p>}
      </div>

      {/* Create Lobby */}
      <div className="section">
        <h2>Create Lobby</h2>
        <button onClick={createLobby}>🎮 Create New Lobby</button>
      </div>

      {/* Current Lobby */}
      <div className="section">
        <h2>Current Lobby</h2>
        {currentLobby ? (
          <div style={{ background: "#0f3460", padding: 15, borderRadius: 8 }}>
            <h3>🎮 Lobby {currentLobby.id}</h3>
            <p style={{ color: "#3498db", fontWeight: "bold" }}>
              👥 {currentLobby.users.length}/4 Players
            </p>
            <div>
              {currentLobby.users.map((u, i) => (
                <div key={u.id} className="user">
                  {i === 0 ? "👑 " : ""}
                  {u.name} {u.id === socket.id ? "(YOU)" : ""}
                </div>
              ))}
            </div>
            <button onClick={leaveLobby}>❌ Leave Lobby</button>
          </div>
        ) : (
          <p style={{ color: "#888" }}>Not in a lobby</p>
        )}
      </div>

      {/* Available Lobbies */}
      <div className="section">
        <h2>Available Lobbies</h2>
        <button onClick={getLobbies}>🔄 Refresh Lobbies</button>
        {lobbies.length === 0 ? (
          <p>No lobbies</p>
        ) : (
          lobbies.map((lobby) => {
            const isFull = lobby.userCount >= 4;
            const isInLobby = currentLobby?.id === lobby.id;
            return (
              <div
                key={lobby.id}
                style={{
                  background: "#0f3460",
                  margin: "10px 0",
                  padding: 10,
                  borderRadius: 5,
                  opacity: isFull ? 0.6 : 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  🎮 Lobby {lobby.id} {isFull && "🔒 Full"}{" "}
                  {isInLobby && "✅ YOU"}
                  <br />
                  👥 {lobby.userCount}/4
                  <br />
                  Players: {lobby.users?.map((u) => u.name).join(", ")}
                </div>
                <button
                  onClick={() => joinLobby(lobby.id)}
                  disabled={isFull || isInLobby}
                >
                  {isInLobby ? "✅ Joined" : isFull ? "🔒 Full" : "➡️ Join"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Logs */}
      <div className="section">
        <h2>📋 Console Logs</h2>
        <button onClick={clearLogs}>Clear Logs</button>
        <div
          style={{
            maxHeight: 300,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: 12,
          }}
        >
          {logs.map((logItem, i) => (
            <div key={i} style={{ color: logColor(logItem.type) }}>
              [{logItem.time}] {logItem.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
