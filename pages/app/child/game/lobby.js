import { useRouter } from "next/navigation";
import { Button } from "../../../../components/buttons/Button";
import LobbyCard from "../../../../components/LobbyCard";
import { useState, useEffect } from "react";
import io from "socket.io-client";

export default function Lobby() {
  const router = useRouter();
  const [lobbies, setLobbies] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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

  // Initialize Socket.IO connection
  // Initialize Socket.IO connection
  useEffect(() => {
    const socketInstance = io(
      "https://norris-nondisguised-behavioristically.ngrok-free.dev",
      {
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        extraHeaders: {
          "ngrok-skip-browser-warning": "true",
        },
        withCredentials: false,
      }
    );

    socketInstance.on("connect", () => {
      console.log("✅ Connected to server:", socketInstance.id);
      setIsConnected(true);
      socketInstance.emit("get_lobbies");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Connection error:", error.message);
      setIsConnected(false);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server. Reason:", reason);
      setIsConnected(false);
    });

    socketInstance.on("lobbies_list", (lobbiesList) => {
      console.log("📋 Received lobbies:", lobbiesList);
      setLobbies(lobbiesList);
    });

    socketInstance.on("lobbies_updated", (lobbiesList) => {
      console.log("🔄 Lobbies updated:", lobbiesList);
      setLobbies(lobbiesList);
    });

    socketInstance.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleLobbyClick = (lobby) => {
    if (!socket) return;

    // Check if lobby is full
    if (lobby.userCount >= 4) {
      alert("This lobby is full!");
      return;
    }

    console.log(`Joining lobby ${lobby.id}`);

    // Join the lobby via Socket.IO
    socket.emit("join_lobby", {
      lobbyId: lobby.id,
      userName: userData.name,
    });

    // Listen for successful join
    socket.once("lobby_joined", (joinedLobby) => {
      console.log("✅ Successfully joined lobby:", joinedLobby);
      router.push(`/app/child/game/${lobby.id}`);
    });
  };

  const handleCreateLobby = () => {
    if (!socket) return;

    console.log("Creating new lobby...");
    socket.emit("create_lobby", userData.name);

    socket.once("lobby_created", (lobby) => {
      console.log("✅ Lobby created:", lobby);
      router.push(`/app/child/game/${lobby.id}`);
    });
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

      {/* Right Side - Lobbies Area */}
      <div className="w-3/4 fade-in relative h-full p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => {
              router.push("/app/child/main");
            }}
            variant="green"
          >
            Back
          </Button>

          <div className="flex items-center gap-4">
            {/* Connection Status */}
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

            {/* Create Lobby Button */}
            <Button onClick={handleCreateLobby} variant="primary">
              + Create Lobby
            </Button>
          </div>
        </div>

        <p className="mt-6 ITC-bold text-2xl px-4">Game Lobbies</p>
        <p className="ITC-medium text-lg px-4 w-1/2">
          Select an open lobby and play with others to earn money and purchase
          new chores to complete.
        </p>

        <div className="flex flex-wrap gap-6 px-4 mt-4">
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
