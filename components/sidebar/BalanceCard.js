export default function BalanceCard({ balance }) {
    return (
      <div className="bg-white p-6 border-4 border-black">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">My Balance</span>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-3xl ITC-demi text-green-600">
          ${balance.toFixed(2)}
        </p>
      </div>
    );
  }
  