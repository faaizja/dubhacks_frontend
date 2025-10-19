export default function ProfileHeader({ name, avatar }) {
    return (
      <div className="bg-white p-6 border-4 border-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl border-4 border-black">
            {avatar}
          </div>
          <h2 className="text-2xl ITC-demi text-gray-800">{name}</h2>
        </div>
      </div>
    );
  }
  