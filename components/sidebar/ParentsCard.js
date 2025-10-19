export default function ParentsCard({ parents }) {
    return (
      <div className="bg-white p-6 border-4 border-black">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">👨‍👩‍👦</span>
          <h3 className="text-lg ITC-demi text-gray-800">My Parents</h3>
        </div>
        <div className="flex flex-col gap-2">
          {parents.map((parent, idx) => (
            <div
              key={idx}
              className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
            >
              {parent}
            </div>
          ))}
        </div>
      </div>
    );
  }
  