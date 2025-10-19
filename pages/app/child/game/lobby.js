"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function LobbyPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [myName, setMyName] = useState("");
  const [currentLobby, setCurrentLobby] = useState(null);
  const [lobbies, setLobbies] = useState([]);
  const [logs, setLogs] = useState([]);

  // Logging helper
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

  // Connect socket once
  useEffect(() => {
    socket = io(
      "https://norris-nondisguised-behavioristically.ngrok-free.dev",
      {
        transports: ["websocket", "polling"],
      }
    );

    // Connection events
    socket.on("connect", () => {
      setIsConnected(true);
      log(`✅ Connected (${socket.id})`, "success");
      socket.emit("get_lobbies"); // fetch initial lobbies
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

    socket.on("lobbies_updated", (updatedLobbies) => {
      log("Lobbies updated", "info");
      setLobbies(updatedLobbies);
    });

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
        const updatedLobby = { id: data.lobbyId, users: data.users };
        setCurrentLobby(updatedLobby);
        setLobbies((prev) =>
          prev.map((l) => (l.id === updatedLobby.id ? updatedLobby : l))
        );
      }
    });

    socket.on("user_left", (data) => {
      if (currentLobby && data.lobbyId === currentLobby.id) {
        const updatedLobby = { id: data.lobbyId, users: data.users };
        setCurrentLobby(updatedLobby);
        setLobbies((prev) =>
          prev.map((l) => (l.id === updatedLobby.id ? updatedLobby : l))
        );
      }
    });

    socket.on("error", (error) => {
      log(`❌ Error: ${error.message}`, "error");
      alert("Error: " + error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // <- connect once

  // Handlers
  function setNameHandler() {
    if (!myName.trim()) {
      alert("Please enter a name");
      return;
    }
    log(`Name set to: ${myName}`, "success");
  }

  function createLobby() {
    if (!myName.trim()) {
      alert("Please set your name first!");
      return;
    }
    log(`Creating lobby as ${myName}...`, "info");
    socket.emit("create_lobby", myName);
  }

  function joinLobby(lobbyId) {
    if (!myName.trim()) {
      alert("Please set your name first!");
      return;
    }
    log(`Joining lobby ${lobbyId} as ${myName}...`, "info");
    socket.emit("join_lobby", { lobbyId, userName: myName });
  }

  function leaveLobby() {
    if (currentLobby?.id) {
      log(`Leaving lobby ${currentLobby.id}...`, "info");
      socket.emit("leave_lobby", currentLobby.id);
      setCurrentLobby(null);
    }
  }

  function getLobbies() {
    log("Fetching lobbies...", "info");
    socket.emit("get_lobbies");
  }

  function clearLogs() {
    setLogs([]);
  }

  return (
    <div className="container">
      <h1>🎮 Lobby System Test</h1>
      <div className={isConnected ? "connected" : "disconnected"}>
        {isConnected ? `✅ Connected (${socket?.id})` : "⚠️ Disconnected"}
      </div>

      {/* User Info */}
      <div className="section">
        <h2>Your Info</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={myName}
          onChange={(e) => setMyName(e.target.value)}
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
        <div>
          {currentLobby ? (
            <div
              style={{ background: "#0f3460", padding: 15, borderRadius: 8 }}
            >
              <h3>🎮 Lobby {currentLobby.id}</h3>
              <p style={{ color: "#3498db", fontWeight: "bold" }}>
                👥 {currentLobby.users.length}/4 Players
              </p>
              <div>
                {currentLobby.users.map((user, index) => (
                  <div className="user" key={user.id}>
                    {index === 0 ? "👑 " : ""}
                    {user.name} {user.id === socket?.id ? "(YOU)" : ""}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: "#888" }}>Not in a lobby</p>
          )}
        </div>
        {currentLobby && <button onClick={leaveLobby}>❌ Leave Lobby</button>}
      </div>

      {/* Available Lobbies */}
      <div className="section">
        <h2>Available Lobbies</h2>
        <button onClick={getLobbies}>🔄 Refresh Lobbies</button>
        <div>
          {lobbies.length === 0 ? (
            <p style={{ color: "#888" }}>No lobbies available. Create one!</p>
          ) : (
            lobbies.map((lobby) => {
              const isFull = lobby.userCount >= 4;
              const isInLobby = currentLobby?.id === lobby.id;
              return (
                <div
                  key={lobby.id}
                  style={{
                    background: "#0f3460",
                    padding: 15,
                    margin: "10px 0",
                    borderRadius: 5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: isFull ? 0.6 : 1,
                  }}
                >
                  <div>
                    <strong>🎮 Lobby {lobby.id}</strong>
                    {isFull && <span className="badge">FULL</span>}
                    {isInLobby && (
                      <span className="badge" style={{ background: "#2ecc71" }}>
                        YOU'RE HERE
                      </span>
                    )}
                    <br />
                    <small style={{ color: "#aaa" }}>
                      👥 {lobby.userCount}/4 players
                    </small>
                    {lobby.users?.length > 0 && (
                      <>
                        <br />
                        <small style={{ color: "#888" }}>
                          Players: {lobby.users.map((u) => u.name).join(", ")}
                        </small>
                      </>
                    )}
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
      </div>

      {/* Logs */}
      <div className="section">
        <h2>📋 Console Logs</h2>
        <button
          onClick={clearLogs}
          style={{ background: "#555", marginBottom: 10 }}
        >
          Clear Logs
        </button>
        <div
          style={{
            maxHeight: 300,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: 12,
          }}
        >
          {logs.map((logItem, index) => (
            <div
              key={index}
              style={{ color: logColor(logItem.type), margin: "5px 0" }}
            >
              [{logItem.time}] {logItem.message}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section {
          background: #16213e;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          border: 1px solid #0f3460;
        }
        input,
        button {
          padding: 12px;
          margin: 5px;
          border-radius: 5px;
          border: 1px solid #0f3460;
          background: #0f3460;
          color: #eee;
          font-size: 14px;
        }
        button {
          cursor: pointer;
          background: #e94560;
        }
        button:hover {
          background: #c23854;
        }
        button:disabled {
          background: #555;
          cursor: not-allowed;
        }
        .user {
          background: #16213e;
          padding: 8px 12px;
          margin: 5px;
          border-radius: 5px;
          display: inline-block;
        }
        .connected {
          background: #2ecc71;
          color: #000;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
          font-weight: bold;
        }
        .disconnected {
          background: #e74c3c;
          color: #fff;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
          font-weight: bold;
        }
        .badge {
          background: #f39c12;
          color: #000;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
