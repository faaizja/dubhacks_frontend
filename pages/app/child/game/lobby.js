import { useRouter } from "next/navigation";
import { Button } from "../../../../components/buttons/Button";
import LobbyCard from "../../../../components/LobbyCard";

export default function Lobby() {
  const router = useRouter();
  const userData = {
    name: "Alex",
    avatar: "👦", // You can replace with an actual image
    balance: 125.5,
    parents: ["Mom", "Dad"],
    stats: {
      choresCompleted: 47,
      gamesPlayed: 23,
      streak: 5,
    },
  };

  const lobbies = [
    { id: 1, status: "open", playerCount: 1 },
    { id: 2, status: "full", playerCount: 6 },
    { id: 3, status: "ongoing", playerCount: 4 },
    { id: 4, status: "ongoing", playerCount: 6 },
    { id: 5, status: "open", playerCount: 3 },
    { id: 6, status: "full", playerCount: 6 },
  ];

  const handleLobbyClick = (lobby) => {
    if (lobby.status === "open") {
      console.log(`Joining lobby #${lobby.id}`);
      router.push(`/app/child/game/${lobby.id}`);
    }
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
      {/* Right Side - Button Area */}
      <div className="w-3/4 fade-in relative h-full p-4">
        <Button
          onClick={() => {
            router.push("/app/child/main");
          }}
          variant="green"
        >
          Back
        </Button>
        <p className="mt-6 ITC-bold text-2xl px-4">Game Lobbies</p>
        <p className="ITC-medium text-lg px-4 w-1/2">
          Select an open lobby and play with others to earn money and purchase
          new chores to complete.
        </p>
        <div className="flex flex-wrap gap-6 px-4 mt-4">
          {lobbies.map((lobby) => (
            <LobbyCard
              key={lobby.id}
              lobby={lobby}
              onClick={() => handleLobbyClick(lobby)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
