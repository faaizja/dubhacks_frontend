import Image from "next/image";
import PlayButton from "../../../assets/PlayButton.png";
import ChoresButton from "../../../assets/ChoresButton.png";
import ProfileButton from "../../../assets/ProfileButton.png";
import WalletButton from "../../../assets/WalletButton.png";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ProfileHeader from "../../../components/sidebar/ProfileHeader";
import BalanceCard from "../../../components/sidebar/BalanceCard";
import ParentsCard from "../../../components/sidebar/ParentsCard";
import StatsCard from "../../../components/sidebar/StatsCard";

export default function Wallet() {
  const router = useRouter();

  const userData = {
    name: "Alex",
    avatar: "👦",
    balance: 125.5,
    tokens: 1500, // Example tokens
    parents: ["Mom", "Dad"],
    stats: {
      choresCompleted: 47,
      gamesPlayed: 23,
      streak: 5,
    },
  };

  const dollarValue = (userData.tokens / 100).toFixed(2);

  return (
    <div className="flex h-screen w-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-[#BDCCBA] h-full p-6 flex flex-col gap-6 overflow-y-auto">
        <ProfileHeader name={userData.name} avatar={userData.avatar} />
        <BalanceCard balance={userData.balance} />
        <ParentsCard parents={userData.parents} />
        <StatsCard stats={userData.stats} />
      </div>

      {/* Right Side - Wallet */}
      <div className="w-3/4 h-full p-10 bg-[#E8F0E6] overflow-y-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black pb-4">
          <div>
            <h1 className="text-4xl ITC-demi text-gray-800">YOUR WALLET 💰</h1>
            <p className="text-gray-600">
              Cash out your hard-earned tokens for cool rewards or save for
              something big!
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/app/child/main")}
              className="border-4 border-black bg-white px-6 py-3 hover:bg-stone-200 transition-all duration-300 ITC-demi"
            >
              ⬅ Back
            </button>
          </div>
        </div>

        {/* Wallet Cards */}
        <div className="grid grid-cols-2 gap-8">
          {/* Token Card */}
          <div className="bg-white border-4 border-black p-6 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl ITC-demi text-gray-800">
                Tokens Earned 🎟️
              </h2>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
                alt="Tokens Icon"
                width={60}
                height={60}
              />
            </div>
            <p className="text-5xl ITC-bold text-green-700 mt-4">
              {userData.tokens.toLocaleString()} Tokens
            </p>
            <p className="text-gray-500 mt-2">(1000 Tokens = $10)</p>
          </div>

          {/* Cash Value Card */}
          <div className="bg-[#FDF7E3] border-4 border-black p-6 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl ITC-demi text-gray-800">
                Cash Value 💵
              </h2>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"
                alt="Cash Icon"
                width={60}
                height={60}
              />
            </div>
            <p className="text-5xl ITC-bold text-green-700 mt-4">
              ${dollarValue}
            </p>
            <button className="mt-4 border-4 border-black bg-green-500 hover:bg-green-400 transition-all duration-300 text-white text-xl ITC-demi py-3">
              💳 Cash Out
            </button>
          </div>
        </div>

        {/* Savings & Progress Section */}
        <div className="bg-white border-4 border-black p-8 shadow-lg mt-6">
          <h3 className="text-2xl ITC-demi mb-4 text-gray-800 flex items-center gap-2">
            🏦 Savings Progress
          </h3>
          <p className="text-gray-600 mb-3">
            You’re saving up for your next goal — keep completing chores and
            games to earn more tokens!
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 border-4 border-black rounded-full h-8">
            <div
              className="bg-green-500 h-full rounded-full text-center text-white ITC-demi"
              style={{ width: "45%" }}
            >
              45%
            </div>
          </div>

          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <span>Goal: $100</span>
            <span>Saved: ${dollarValue}</span>
          </div>
        </div>

        {/* Monopoly Visuals */}
        <div className="grid grid-cols-3 gap-6 mt-10">
          <div className="bg-[#FFF3C4] border-4 border-black p-4 flex flex-col items-center justify-center">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/6784/6784656.png"
              alt="House Icon"
              width={80}
              height={80}
            />
            <p className="text-lg ITC-demi text-gray-800 mt-2">Properties</p>
          </div>
          <div className="bg-[#D4F6CC] border-4 border-black p-4 flex flex-col items-center justify-center">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/4221/4221452.png"
              alt="Bank Icon"
              width={80}
              height={80}
            />
            <p className="text-lg ITC-demi text-gray-800 mt-2">Investments</p>
          </div>
          <div className="bg-[#FFD6D6] border-4 border-black p-4 flex flex-col items-center justify-center">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/706/706164.png"
              alt="Piggy Bank"
              width={80}
              height={80}
            />
            <p className="text-lg ITC-demi text-gray-800 mt-2">Savings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
