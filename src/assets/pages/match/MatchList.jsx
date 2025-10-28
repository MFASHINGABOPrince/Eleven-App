import React, { useState } from "react";

const MatchList = ({ matches, onReschedule, onRecordScore }) => {
  const [scores, setScores] = useState({});
  const [editingMatch, setEditingMatch] = useState(null);
  const [reschedulingMatch, setReschedulingMatch] = useState(null);
  const [newDate, setNewDate] = useState("");

  if (!matches.length) {
    return <p className="mt-6 text-gray-500">No matches found for this league.</p>;
  }

  const handleScoreChange = (matchId, field, value) => {
    setScores({
      ...scores,
      [matchId]: {
        ...scores[matchId],
        [field]: value,
      },
    });
  };

  const handleSaveScore = (matchId) => {
    const score = scores[matchId];
    if (score?.score1 && score?.score2) {
      onRecordScore(matchId, parseInt(score.score1), parseInt(score.score2));
      setEditingMatch(null);
      setScores({
        ...scores,
        [matchId]: { score1: "", score2: "" },
      });
    } else {
      alert("Please enter both scores!");
    }
  };

  const handleReschedule = (matchId) => {
    if (newDate) {
      onReschedule(matchId, newDate);
      setReschedulingMatch(null);
      setNewDate("");
    } else {
      alert("Please select a new date!");
    }
  };

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray)) {
      const [year, month, day] = dateArray;
      return `${day}/${month}/${year}`;
    }
    return "Not set";
  };

  const getDateForInput = (dateArray) => {
    if (Array.isArray(dateArray)) {
      const [year, month, day] = dateArray;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return "";
  };

  return (
    <div className="grid gap-4 mt-4">
      {matches.map((match) => {
        const isEditing = editingMatch === match.id;
        const isRescheduling = reschedulingMatch === match.id;
        const hasScore = match.scorePlayer1 > 0 || match.scorePlayer2 > 0;

        return (
          <div
            key={match.id}
            className="bg-white shadow-md p-5 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-800">
                  {match.player1?.name} 
                  <span className="mx-2 text-gray-400">vs</span>
                  {match.player2?.name}
                </h3>
                
                {/* Date Display or Reschedule Input */}
                {!isRescheduling ? (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500">
                      📅 {formatDate(match.scheduledDate)}
                      {" • "}
                      <span className="font-medium">{match.round}</span>
                    </p>
                    {!hasScore && (
                      <button
                        onClick={() => {
                          setReschedulingMatch(match.id);
                          setNewDate(getDateForInput(match.scheduledDate));
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="border border-blue-300 px-2 py-1 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleReschedule(match.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      ✓ Save
                    </button>
                    <button
                      onClick={() => {
                        setReschedulingMatch(null);
                        setNewDate("");
                      }}
                      className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Winner Badge */}
              {match.winner && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  🏆 {match.winner.name}
                </div>
              )}
            </div>

            {/* Score Display or Input */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {!isEditing && hasScore ? (
                // Erekana scores zihari
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{match.player1?.name}</p>
                      <p className="text-3xl font-bold text-blue-600">{match.scorePlayer1}</p>
                    </div>
                    <span className="text-2xl text-gray-300">-</span>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{match.player2?.name}</p>
                      <p className="text-3xl font-bold text-blue-600">{match.scorePlayer2}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingMatch(match.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    ✏️ Edit Score
                  </button>
                </div>
              ) : (
                // Input za scores
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      {match.player1?.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={scores[match.id]?.score1 || ""}
                      onChange={(e) =>
                        handleScoreChange(match.id, "score1", e.target.value)
                      }
                      className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <span className="text-2xl text-gray-400 mt-5">:</span>

                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      {match.player2?.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={scores[match.id]?.score2 || ""}
                      onChange={(e) =>
                        handleScoreChange(match.id, "score2", e.target.value)
                      }
                      className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => handleSaveScore(match.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium"
                    >
                      💾 Save
                    </button>
                    {hasScore && (
                      <button
                        onClick={() => {
                          setEditingMatch(null);
                          setScores({ ...scores, [match.id]: {} });
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Match Stats */}
            {hasScore && !isEditing && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">🎯 Goals:</span>
                    <span className="ml-2 font-semibold">
                      {match.scorePlayer1} - {match.scorePlayer2}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">📊 Result:</span>
                    <span className="ml-2 font-semibold">
                      {match.winner 
                        ? `${match.winner.name} wins (+1 point)` 
                        : "Draw"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MatchList;