export default function StatsCard({ stats }) {
    return (
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
              {stats.choresCompleted}
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
              {stats.gamesPlayed}
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
              {stats.streak}
            </span>
          </div>
        </div>
      </div>
    );
  }
  