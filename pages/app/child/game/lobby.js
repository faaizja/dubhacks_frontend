"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "../../../../utils/socket";
import LobbyCard from "../../../../components/LobbyCard";
import { Button } from "../../../../components/buttons/Button";

export default function Lobby() {
  const router = useRouter();
  const socket = getSocket();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lobbies, setLobbies] = useState([]);
  const [currentLobbyId, setCurrentLobbyId] = useState(null);

  const userData = {
    name: "Alex", // You can replace with dynamic input
    avatar: "👦",
    balance: 125.5,
    parents: ["Mom", "Dad"],
    stats: { choresCompleted: 47, gamesPlayed: 23, streak: 5 },
  };

  // ---------------- Socket Event Handlers ----------------
  useEffect(() => {
    const onConnect = () => {
      console.log("✅ Connected:", socket.id);
      setIsConnected(true);
      socket.emit("get_lobbies");
    };

    const onDisconnect = () => {
      console.log("❌ Disconnected");
      setIsConnected(false);
    };

    const onLobbiesList = (list) => {
      setLobbies(list);
    };

    const onLobbiesUpdated = (list) => {
      setLobbies(list);
    };

    const onUserJoined = (data) => {
      setLobbies((prev) =>
        prev.map((lobby) =>
          lobby.id === data.lobbyId
            ? { ...lobby, users: data.users, userCount: data.users.length }
            : lobby
        )
      );
      if (currentLobbyId === data.lobbyId) {
        setCurrentLobbyId(data.lobbyId);
      }
    };

    const onUserLeft = (data) => {
      setLobbies((prev) =>
        prev.map((lobby) =>
          lobby.id === data.lobbyId
            ? { ...lobby, users: data.users, userCount: data.users.length }
            : lobby
        )
      );
      if (currentLobbyId === data.lobbyId && data.users.length === 0) {
        setCurrentLobbyId(null);
      }
    };

    const onLobbyCreated = (lobby) => {
      setCurrentLobbyId(lobby.id);
      router.push(`/app/child/game/${lobby.id}`);
    };

    const onLobbyJoined = (lobby) => {
      setCurrentLobbyId(lobby.id);
      router.push(`/app/child/game/${lobby.id}`);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("lobbies_list", onLobbiesList);
    socket.on("lobbies_updated", onLobbiesUpdated);
    socket.on("user_joined", onUserJoined);
    socket.on("user_left", onUserLeft);
    socket.on("lobby_created", onLobbyCreated);
    socket.on("lobby_joined", onLobbyJoined);

    if (socket.connected) {
      socket.emit("get_lobbies");
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("lobbies_list", onLobbiesList);
      socket.off("lobbies_updated", onLobbiesUpdated);
      socket.off("user_joined", onUserJoined);
      socket.off("user_left", onUserLeft);
      socket.off("lobby_created", onLobbyCreated);
      socket.off("lobby_joined", onLobbyJoined);
    };
  }, [socket, router, currentLobbyId]);

  // ---------------- Actions ----------------
  const handleCreateLobby = () => {
    if (!userData.name) return alert("Please set your name first!");
    socket.emit("create_lobby", userData.name);
  };

  const handleLobbyClick = (lobby) => {
    if (lobby.userCount >= 4) return alert("This lobby is full!");
    socket.emit("join_lobby", { lobbyId: lobby.id, userName: userData.name });
  };

  // ---------------- Render ----------------
  return (
    <div className="flex h-screen w-screen">
      {/* LEFT PANEL */}
      <div className="w-1/4 bg-[#BDCCBA] h-full p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Profile Card */}
        <div className="bg-white p-6 border-4 border-black flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl border-4 border-black">
            {userData.avatar}
          </div>
          <h2 className="text-2xl ITC-demi text-gray-800">{userData.name}</h2>
        </div>

        {/* Balance */}
        <div className="bg-white p-6 border-4 border-black">
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

        {/* Parents */}
        <div className="bg-white p-6 border-4 border-black">
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

        {/* Stats */}
        <div className="bg-white p-6 border-4 border-black">
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

      {/* RIGHT PANEL */}
      <div className="w-3/4 relative h-full p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push("/app/child/main")}
            variant="green"
          >
            Back
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <Button onClick={handleCreateLobby} variant="primary">
              + Create Lobby
            </Button>
          </div>
        </div>

        {/* Lobby List */}
        <div className="flex flex-wrap gap-6 overflow-y-auto">
          {lobbies.length === 0 ? (
            <div className="w-full text-center py-12">
              <p className="text-xl text-gray-500 ITC-medium">
                No lobbies available. Create one to get started! 🎮
              </p>
            </div>
          ) : (
            lobbies.map((lobby) => (
              <LobbyCard
                key={lobby.id}
                lobby={{
                  id: lobby.id,
                  status: lobby.userCount >= 4 ? "full" : "open",
                  players: lobby.userCount,
                  maxPlayers: 4,
                  users: lobby.users || [],
                }}
                onClick={() => handleLobbyClick(lobby)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
