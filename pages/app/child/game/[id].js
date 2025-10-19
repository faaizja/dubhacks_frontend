"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import boat from "../../../../assets/boat.png";
import boot from "../../../../assets/boot.png";
import dog from "../../../../assets/dog.png";
import car from "../../../../assets/car.png";

export default function WaitingRoom() {
  // ✅ Hardcoded DB User ID for now
  const dbUserId = "63046610-4264-4ace-a20b-d60633443c9e";

  return (
    <div className="flex h-screen w-screen">
      {/* --- Sidebar: Players --- */}
      <div className="w-1/4 bg-gray-200 h-full p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="bg-white p-6 border-4 border-black flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl border-4 border-black">
            👦
          </div>
          <h2 className="text-2xl font-bold">{userName}</h2>
        </div>
      </div>

      {/* --- Main: Character selection --- */}
      <div className="w-3/4 relative h-full p-4">
        <p className="mt-6 font-bold text-2xl px-4">Pick your character</p>
        {/* <div className="flex flex-wrap gap-6 px-4 mt-4">
          {characters.map((c) => (
            <div
              key={c.id}
              className={`p-6 rounded-lg text-center cursor-pointer border-2 border-black transition-all ${
                c.selected
                  ? "opacity-50 scale-95"
                  : selectedCharacterId === c.id
                  ? "bg-green-200 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => handleSelectCharacter(c)}
            >
              <div className="w-32 h-32 relative">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 font-bold">{c.name}</p>
              {c.selectedBy && (
                <p className="text-sm text-gray-700">
                  {c.selectedBy === userName ? "You" : c.selectedBy}
                </p>
              )}
            </div>
          ))}
        </div>
        <button
          className={`mt-4 px-4 py-2 font-bold border-2 border-black rounded ${
            isReady ? "bg-green-400" : "bg-gray-200"
          }`}
          onClick={handleReady}
        >
          {isReady ? "Ready ✅" : "Ready"}
        </button> */}
      </div>
    </div>
  );
}
