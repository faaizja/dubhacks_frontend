import Image from "next/image";
import PlayButton from "../../../assets/PlayButton.png";
import ChoresButton from "../../../assets/ChoresButton.png";
import ProfileButton from "../../../assets/ProfileButton.png";
import WalletButton from "../../../assets/WalletButton.png";

export default function Main() {
  // Mock data - replace with actual user data
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
      <div className="w-3/4 relative h-full">
        <button className="absolute border-4 bg-white transition-all duration-500 ease-in-out hover:bg-stone-200 border-black group top-2 left-2 w-max h-max">
          <Image
            className="group-hover:p-1 transition-all duration-500 ease-in-out"
            width={"236"}
            src={ChoresButton}
          />
        </button>
        <button className="absolute border-4 bg-white transition-all duration-500 ease-in-out hover:bg-stone-200 border-black group top-2 right-2 w-max h-max">
          <Image
            className="group-hover:p-1 transition-all duration-500 ease-in-out"
            width={"236"}
            src={ProfileButton}
          />
        </button>
        <button className="absolute border-4 bg-white transition-all duration-500 ease-in-out hover:bg-stone-200 border-black group bottom-2 left-2 w-max h-max">
          <Image
            className="group-hover:p-1 transition-all duration-500 ease-in-out"
            width={"236"}
            src={WalletButton}
          />
        </button>
        <button
          onClick={() => {
            router.push("/app/child/game/lobby");
          }}
          className="absolute border-4 bg-white transition-all duration-500 ease-in-out hover:bg-stone-200 border-black group bottom-2 right-2 w-max h-max"
        >
          <Image
            className="group-hover:p-1 transition-all duration-500 ease-in-out"
            width={"236"}
            src={PlayButton}
          />
        </button>
      </div>
    </div>
  );
}
