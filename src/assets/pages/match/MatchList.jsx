import React, { useState } from "react";

const MatchList = ({ 
  matches, 
  onReschedule, 
  onRecordScore, 
  onForfeit 
}) => {
  const [scores, setScores] = useState({});
  const [editingMatch, setEditingMatch] = useState(null);
  const [reschedulingMatch, setReschedulingMatch] = useState(null);
  const [newDate, setNewDate] = useState("");

  if (!matches.length) {
    return <p className="mt-6 text-gray-500">No matches found for this league.</p>;
  }
  const sortedMatches = [...matches].sort((a, b) => {
    const getRoundNumber = (roundStr) => {
      const match = roundStr?.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };
    return getRoundNumber(a.round) - getRoundNumber(b.round);
  });
  const matchesByRound = sortedMatches.reduce((acc, match) => {
    const round = match.round || "Unknown Round";
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});

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
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
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

  const getDaysUntilDeadline = (deadlineDate) => {
    if (!Array.isArray(deadlineDate)) return null;
    const [year, month, day] = deadlineDate;
    const deadline = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (match) => {
    if (!match.deadlineDate) return null;
    const days = getDaysUntilDeadline(match.deadlineDate);
    
    if (days < 0) {
      return { text: "OVERDUE", color: "bg-red-100 text-red-800", badge: "🔴" };
    } else if (days === 0) {
      return { text: "DUE TODAY", color: "bg-orange-100 text-orange-800", badge: "⏰" };
    } else if (days <= 3) {
      return { text: `${days}d left`, color: "bg-yellow-100 text-yellow-800", badge: "⚠️" };
    } else {
      return { text: `${days}d left`, color: "bg-blue-100 text-blue-800", badge: "📅" };
    }
  };

  const renderMatch = (match) => {
    const isEditing = editingMatch === match.id;
    const isRescheduling = reschedulingMatch === match.id;
    const hasScore = match.scorePlayer1 > 0 || match.scorePlayer2 > 0;
    const deadlineStatus = getDeadlineStatus(match);

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
              <div className="flex items-center gap-3 mt-2">
                <p className="text-sm text-gray-500">
                  📅 {formatDate(match.scheduledDate)}
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
                  ✓
                </button>
                <button
                  onClick={() => {
                    setReschedulingMatch(null);
                    setNewDate("");
                  }}
                  className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Deadline Display - READ ONLY (Auto-calculated) */}
            {match.deadlineDate && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">
                  ⏰ Deadline: {formatDate(match.deadlineDate)}
                </p>
                <span 
                  className="text-xs text-gray-400 italic"
                  title="Deadline is automatically set to 7 days after the scheduled date"
                >
                  (auto: +7 days)
                </span>
              </div>
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-col items-end gap-2">
            {match.winner && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                🏆 {match.winner.name}
              </div>
            )}
            {deadlineStatus && !match.winner && (
              <div className={`${deadlineStatus.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
                <span>{deadlineStatus.badge}</span>
                {deadlineStatus.text}
              </div>
            )}
          </div>
        </div>

        {/* Score Display or Input */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {!isEditing && hasScore ? (
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
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
              >
                Edit Score
              </button>
            </div>
          ) : (
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
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
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
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => handleSaveScore(match.id)}
                  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 font-medium"
                >
                  Save
                </button>
                {hasScore && (
                  <button
                    onClick={() => {
                      setEditingMatch(null);
                      setScores({ ...scores, [match.id]: {} });
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        {!match.winner && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => onForfeit(match)}
              className="w-full border border-green-700 text-green-700 px-3 py-2 rounded-md hover:bg-green-700 hover:text-white text-sm font-medium"
            >
             Forfeit Match
            </button>
          </div>
        )}

        {/* Match Info */}
        {hasScore && !isEditing && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">🎯 Final Score:</span>
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
        {deadlineStatus && deadlineStatus.badge === "🔴" && !match.winner && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-xs text-red-800">
              ⚠️ <strong>This match is overdue!</strong> The deadline has passed. 
              Please complete the match or it will be auto-forfeited.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-4">
      {Object.entries(matchesByRound).map(([round, roundMatches]) => (
        <div key={round} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800">{round}</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">
              {roundMatches.length} {roundMatches.length === 1 ? 'match' : 'matches'}
            </span>
          </div>
          
          <div className="grid gap-4">
            {roundMatches.map(match => renderMatch(match))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;