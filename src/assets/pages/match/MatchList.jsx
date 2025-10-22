import React, { useState } from "react";

const MatchList = ({ matches, onReschedule }) => {
  const [rescheduleData, setRescheduleData] = useState({});

  if (!matches.length) {
    return <p className="mt-6 text-gray-500">No matches found for this league.</p>;
  }

  return (
    <div className="grid gap-4 mt-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white shadow p-4 rounded-md flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg">
              {match.teamA.name} vs {match.teamB.name}
            </h3>
            <p className="text-sm text-gray-600">
              Date: {new Date(match.matchDate).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={rescheduleData[match.id] || ""}
              onChange={(e) =>
                setRescheduleData({
                  ...rescheduleData,
                  [match.id]: e.target.value,
                })
              }
              className="border p-1 rounded-md"
            />
            <button
              onClick={() =>
                onReschedule(match.id, rescheduleData[match.id])
              }
              className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
            >
              Reschedule
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
