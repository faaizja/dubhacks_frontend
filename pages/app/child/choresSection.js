import Image from "next/image";
import PlayButton from "../../../assets/PlayButton.png";
import ChoresButton from "../../../assets/ChoresButton.png";
import ProfileButton from "../../../assets/ProfileButton.png";
import WalletButton from "../../../assets/WalletButton.png";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function choresSection() {
    const router = useRouter();
    // Mock data - replace with actual user data
    const userData = {
      name: "Alex",
      avatar: "👦",
      balance: 125.5,
      tokens: 150, // Added tokens
      parents: ["Mom", "Dad"],
      stats: {
        choresCompleted: 47,
        gamesPlayed: 23,
        streak: 5,
      },
    };

    const [availableChores, setAvailableChores] = useState([
        { id: 1, title: "CLEAN YOUR ROOM", reward: 5.00, tokens: 50, icon: "🧹", category: "HOME" },
        { id: 2, title: "DO THE DISHES", reward: 3.00, tokens: 30, icon: "🍽️", category: "HOME" },
        { id: 3, title: "TAKE OUT TRASH", reward: 2.00, tokens: 20, icon: "🗑️", category: "HOME" },
        { id: 4, title: "VACUUM LIVING ROOM", reward: 4.00, tokens: 40, icon: "🌀", category: "HOME" },
        { id: 5, title: "WATER PLANTS", reward: 2.50, tokens: 25, icon: "🌱", category: "HOME" },
    ]);
    
    const [boughtChores, setBoughtChores] = useState([
        { id: 6, title: "WASH THE CAR", reward: 8.00, icon: "🚗", status: "In Progress", category: "HOME" },
        { id: 7, title: "MOW THE LAWN", reward: 10.00, icon: "🌿", status: "Not Started", category: "HOME" },
    ]);
    
    const [completedChores, setCompletedChores] = useState([
        { id: 8, title: "MAKE YOUR BED", reward: 2.00, icon: "🛏️", completedDate: "Today", category: "HOME" },
        { id: 9, title: "FEED THE PET", reward: 3.00, icon: "🐕", completedDate: "Yesterday", category: "HOME" },
        { id: 10, title: "ORGANIZE BOOKS", reward: 4.00, icon: "📚", completedDate: "2 days ago", category: "HOME" },
    ]);
    
    const handleBuyChore = (chore) => {
        if (userData.tokens >= chore.tokens) {
          setAvailableChores(availableChores.filter(c => c.id !== chore.id));
          setBoughtChores([...boughtChores, { ...chore, status: "Not Started" }]);
        }
    };
    
    const handleCompleteChore = (chore) => {
        setBoughtChores(boughtChores.filter(c => c.id !== chore.id));
        setCompletedChores([{ ...chore, completedDate: "Today" }, ...completedChores]);
    };

    // Chore Card Component
    const ChoreCard = ({ chore, type }) => {
      return (
        <div className="bg-white border-4 border-black overflow-hidden">
          {/* Brown Header */}
          <div className="bg-[#8B4513] px-4 py-3 border-b-4 border-black">
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold tracking-wider">{chore.category}</span>
              <span className="text-3xl">{chore.icon}</span>
            </div>
          </div>

          {/* White Body */}
          <div className="bg-white p-4">
            <h3 className="text-center font-bold text-gray-800 text-sm mb-4 tracking-wide">
              {chore.title}
            </h3>

            {/* Cost/Reward Section */}
            <div className="space-y-2 mb-4">
              {type === 'available' && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b-2 border-gray-300">
                    <span className="text-xs font-semibold text-gray-700">Purchase Cost</span>
                    <span className="text-sm font-bold text-gray-800">🪙{chore.tokens}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-700">Cash Out</span>
                    <span className="text-sm font-bold text-green-600">${chore.reward.toFixed(2)}</span>
                  </div>
                </>
              )}

              {type === 'bought' && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b-2 border-gray-300">
                    <span className="text-xs font-semibold text-gray-700">Status</span>
                    <span className={`text-xs font-bold px-2 py-1 border-2 border-black ${
                      chore.status === "In Progress" ? "bg-blue-200" : "bg-gray-200"
                    }`}>
                      {chore.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-700">Cash Out</span>
                    <span className="text-sm font-bold text-green-600">${chore.reward.toFixed(2)}</span>
                  </div>
                </>
              )}

              {type === 'completed' && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b-2 border-gray-300">
                    <span className="text-xs font-semibold text-gray-700">Completed</span>
                    <span className="text-xs font-bold text-gray-600">{chore.completedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-700">Earned</span>
                    <span className="text-sm font-bold text-green-600">${chore.reward.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Button */}
            {type === 'available' && (
              <button
                onClick={() => handleBuyChore(chore)}
                disabled={userData.tokens < chore.tokens}
                className={`w-full py-2 font-bold text-sm border-2 border-black transition-all ${
                  userData.tokens >= chore.tokens
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-800'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                {userData.tokens >= chore.tokens ? 'BUY NOW' : 'NOT ENOUGH TOKENS'}
              </button>
            )}

            {type === 'bought' && (
              <button
                onClick={() => handleCompleteChore(chore)}
                className="w-full py-2 font-bold text-sm border-2 border-black bg-green-400 hover:bg-green-500 transition-all text-gray-800"
              >
                MARK AS DONE
              </button>
            )}

            {type === 'completed' && (
              <div className="w-full py-2 font-bold text-sm border-2 border-black bg-gray-200 text-center text-gray-600">
                ✓ COMPLETED
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="flex h-screen w-screen">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-[#BDCCBA] h-full p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Profile Header */}
          <div className="bg-white p-6 border-4 border-black">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl border-4 border-black">
                {userData.avatar}
              </div>
              <h2 className="text-2xl ITC-demi text-gray-800">{userData.name}</h2>
            </div>
          </div>
  
          {/* Balance Card */}
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

          {/* Tokens Card */}
          <div className="bg-white p-6 border-4 border-black">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Game Tokens
              </span>
              <span className="text-2xl">🪙</span>
            </div>
            <p className="text-3xl ITC-demi text-yellow-600">
              {userData.tokens}
            </p>
          </div>
  
          {/* Parents Card */}
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
  
          {/* Stats Card */}
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
  
        {/* Right Side - Chores Area */}
        <div className="w-3/4 h-full p-6 overflow-y-auto bg-[#E8F0E6]">
          <div className="mb-6">
            <h1 className="text-4xl ITC-demi text-gray-800 mb-2">YOUR CHORES</h1>
            <p className="text-gray-600">Buy chores with tokens, complete them, and earn real money!</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Available to Buy Column */}
            <div className="flex flex-col">
              <div className="bg-white border-4 border-black p-4 mb-4">
                <h2 className="text-xl ITC-demi text-gray-800 flex items-center gap-2">
                  <span>🛒</span> Available to Buy
                </h2>
              </div>
              <div className="space-y-4 overflow-y-auto">
                {availableChores.map((chore) => (
                  <ChoreCard key={chore.id} chore={chore} type="available" />
                ))}
              </div>
            </div>

            {/* Bought/In Progress Column */}
            <div className="flex flex-col">
              <div className="bg-white border-4 border-black p-4 mb-4">
                <h2 className="text-xl ITC-demi text-gray-800 flex items-center gap-2">
                  <span>📋</span> My Chores
                </h2>
              </div>
              
              <div className="space-y-4 overflow-y-auto">
                {boughtChores.map((chore) => (
                  <ChoreCard key={chore.id} chore={chore} type="bought" />
                ))}
                {boughtChores.length === 0 && (
                  <div className="bg-white border-4 border-black p-6 text-center">
                    <p className="text-gray-500 font-medium">No chores yet! Buy some with your tokens.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="flex flex-col">
              <div className="bg-white border-4 border-black p-4 mb-4">
                <h2 className="text-xl ITC-demi text-gray-800 flex items-center gap-2">
                  <span>✅</span> Completed
                </h2>
              </div>
              <div className="space-y-4 overflow-y-auto">
                {completedChores.map((chore) => (
                  <ChoreCard key={chore.id} chore={chore} type="completed" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}