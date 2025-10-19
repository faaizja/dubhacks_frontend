import Image from "next/image";
import PlayButton from "../../../assets/PlayButton.png";
import ChoresButton from "../../../assets/ChoresButton.png";
import WalletButton from "../../../assets/WalletButton.png";
import { useRouter } from "next/navigation";

// Import new components
import ProfileHeader from "../../../components/sidebar/ProfileHeader";
import BalanceCard from "../../../components/sidebar/BalanceCard";
import ParentsCard from "../../../components/sidebar/ParentsCard";
import StatsCard from "../../../components/sidebar/StatsCard";

export default function Main() {
  const router = useRouter();

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

  const handleClick = () => {
    router.push("/app/child/choresSection");
  };

  const openWallet = () => {
    router.push("/app/child/choresSection");
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

      {/* Right Side - Buttons */}
      <div className="w-3/4 fade-in h-full flex flex-col justify-end">
        <div className="flex w-full">
          {/* Chores Button */}
          <button
            onClick={handleClick}
            className="flex-1 border-4 border-black bg-white hover:bg-stone-200 transition-all duration-500 ease-in-out flex justify-center items-center"
          >
            <Image
              className="group-hover:p-1 transition-all duration-500 ease-in-out"
              width={200}
              src={ChoresButton}
              alt="Chores"
            />
          </button>

          {/* Wallet Button */}
          <button 
          onClick={openWallet}
          className="flex-1 border-4 border-black bg-white hover:bg-stone-200 transition-all duration-500 ease-in-out flex justify-center items-center">
            <Image
              className="group-hover:p-1 transition-all duration-500 ease-in-out"
              width={200}
              src={WalletButton}
              alt="Wallet"
            />
          </button>

          {/* Play Button */}
          <button
            onClick={() => router.push("/app/child/game/lobby")}
            className="flex-1 border-4 border-black bg-white hover:bg-stone-200 transition-all duration-500 ease-in-out flex justify-center items-center"
          >
            <Image
              className="group-hover:p-1 transition-all duration-500 ease-in-out"
              width={200}
              src={PlayButton}
              alt="Play"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
