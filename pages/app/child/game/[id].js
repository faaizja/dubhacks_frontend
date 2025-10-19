// WaitingRoom.jsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSocket } from "../../../../utils/socket";

export default function WaitingRoom() {
  const searchParams = useSearchParams();
  const lobbyId = searchParams.get("id") || searchParams.get("lobbyId");
  const userName = searchParams.get("name");
  const socket = getSocket();

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!lobbyId || !userName) return;

    const updatePlayers = (lobby) => setPlayers(lobby.users || []);
    const handleUserJoined = ({ lobbyId: lId, users }) =>
      lId === lobbyId && setPlayers(users);
    const handleUserLeft = ({ lobbyId: lId, users }) =>
      lId === lobbyId && setPlayers(users);

    socket.emit("join_lobby", { lobbyId, userName });
    socket.emit("get_lobby", lobbyId);

    socket.on("lobby_data", updatePlayers);
    socket.on("lobby_joined", updatePlayers);
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);

    return () => {
      socket.off("lobby_data", updatePlayers);
      socket.off("lobby_joined", updatePlayers);
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);
      socket.emit("leave_lobby", lobbyId);
    };
  }, [lobbyId, userName, socket]);

  return (
    <div>
      <h1>Waiting Room</h1>
      <h2>Players:</h2>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.name} {p.name === userName ? "(YOU)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
