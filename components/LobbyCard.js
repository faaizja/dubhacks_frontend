export default function LobbyCard({ lobby, onClick, lobbyNum }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "open":
        return {
          color: "text-green-700",
          label: "LOBBY OPEN",
          disabled: false,
          opacity: "",
        };
      case "full":
        return {
          color: "text-red-700",
          label: "LOBBY FULL",
          disabled: true,
          opacity: "opacity-20",
        };
      case "ongoing":
        return {
          color: "text-blue-700",
          label: "GAME ONGOING",
          disabled: true,
          opacity: "opacity-20",
        };
      default:
        return {
          color: "text-gray-700",
          label: "UNKNOWN",
          disabled: true,
          opacity: "opacity-20",
        };
    }
  };

  const config = getStatusConfig(lobby.status);

  return (
    <button
      className="bg-white w-80 h-52 p-4 relative disabled:cursor-not-allowed transition-all duration-500 ease-in-out hover:scale-[98%] disabled:hover:scale-100"
      onClick={onClick}
      disabled={config.disabled}
    >
      <div className="border-2 w-full flex flex-col p-4 h-full border-black relative">
        <p className={`text-lg ITC-demi ${config.opacity}`}>
          Lobby #{lobbyNum}
        </p>
        <p className={`text-2xl mt-6 ITC-medium ${config.opacity}`}>
          Click to join lobby
        </p>
        <p className={`text-base ITC-medium ${config.opacity}`}>
          {lobby.playerCount} {lobby.playerCount === 1 ? "player" : "players"}{" "}
          in lobby
        </p>

        {/* Label positioned on the border */}
        <p
          className={`absolute ${config.color} w-max -bottom-2.5 left-1/2 -translate-x-1/2 bg-white px-3 text-sm ITC-book`}
        >
          {config.label}
        </p>
      </div>
    </button>
  );
}
