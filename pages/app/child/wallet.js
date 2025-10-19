import Image from "next/image";
import PlayButton from "../../../assets/PlayButton.png";
import ChoresButton from "../../../assets/ChoresButton.png";
import ProfileButton from "../../../assets/ProfileButton.png";
import WalletButton from "../../../assets/WalletButton.png";
import { useRouter } from "next/navigation";
import { useState } from 'react';

import ProfileHeader from "../../../components/sidebar/ProfileHeader";
import BalanceCard from "../../../components/sidebar/BalanceCard";
import ParentsCard from "../../../components/sidebar/ParentsCard";
import StatsCard from "../../../components/sidebar/StatsCard";

export default function Wallet() {
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

    return (
    <div className="flex h-screen w-screen">

        {/* Left Sidebar */}
      <div className="w-1/4 bg-[#BDCCBA] h-full p-6 flex flex-col gap-6 overflow-y-auto">
        <ProfileHeader name={userData.name} avatar={userData.avatar} />
        <BalanceCard balance={userData.balance} />
        <ParentsCard parents={userData.parents} />
        <StatsCard stats={userData.stats} />
      </div>
  
          {/* Stats Card */}
          <div className="bg-white p-6 border-4 border-black">
            <h3 className="text-lg ITC-demi text-gray-800 mb-4">My Stats</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">


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
  
        {/* Right Side - Chores Area */}
        <div className="w-3/4 h-full p-6 overflow-y-auto bg-[#E8F0E6]">
          <div className="mb-6">
            <h1 className="text-4xl ITC-demi text-gray-800 mb-2">YOUR wallet</h1>
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