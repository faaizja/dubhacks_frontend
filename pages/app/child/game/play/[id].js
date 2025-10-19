"use client";
import { getSocket } from "../../../../../utils/socket";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GameBoard from "../../../../../assets/GameBoard.png";
import Image from "next/image";

export default function Game() {
  useEffect(() => {}, []);

  return (
    <div className="relative w-[800px] h-[800px] mx-auto mt-6 overflow-hidden">
      <Image src={GameBoard} alt="Game Board" fill className="object-contain" />
    </div>
  );
}
