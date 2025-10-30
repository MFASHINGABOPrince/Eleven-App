import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/assets/lib/axios";
import LeagueDropdown from "../league/ LeagueDropdown";
import MatchList from "./MatchList";
import { useSelector } from "react-redux";
import SideBar from "../side-bar/SideBar";

const Match = () => {
  const { user } = useSelector((state) => state.reducer.auth);
  const token = user?.payload?.tokens?.accessToken;

  const [selectedLeague, setSelectedLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [overdueMatches, setOverdueMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showForfeitModal, setShowForfeitModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [forfeitPlayerId, setForfeitPlayerId] = useState("");
  const [forfeitReason, setForfeitReason] = useState("");

  useEffect(() => {
    if (selectedLeague) {
      fetchMatches(selectedLeague);
      fetchOverdueMatches();
    }
  }, [selectedLeague]);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchMatches = async (leagueId) => {
    try {
      setLoading(true);
      const res = await api.get(
        `http://localhost:2020/api/v1/matches/league/${leagueId}`,
        { headers: getAuthHeaders() }
      );
      setMatches(res.data);
    } catch (err) {
      toast.error("Failed to load matches!");
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdueMatches = async () => {
    try {
      const res = await api.get(
        `http://localhost:2020/api/v1/matches/overdue`,
        { headers: getAuthHeaders() }
      );
      setOverdueMatches(res.data);
    } catch (err) {
      console.error("Failed to fetch overdue matches:", err);
    }
  };

  const handleGenerateMatches = async () => {
    if (!selectedLeague) {
      toast.warning("Select a league first!");
      return;
    }
    try {
      await api.post(
        `http://localhost:2020/api/v1/matches/generate/${selectedLeague}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success("Matches generated successfully!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to generate matches");
    }
  };

  const handleReschedule = async (matchId, newDate) => {
    try {
      await api.put(
        `http://localhost:2020/api/v1/matches/reschedule/${matchId}?newDate=${newDate}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success("Match rescheduled!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to reschedule match");
    }
  };

  const handleRecordResult = async (matchId, scorePlayer1, scorePlayer2) => {
    if (scorePlayer1 === "" || scorePlayer2 === "") {
      toast.warning("Please enter both scores");
      return;
    }

    try {
      await api.put(
        `http://localhost:2020/api/v1/matches/result/${matchId}`,
        { scorePlayer1: parseInt(scorePlayer1), scorePlayer2: parseInt(scorePlayer2) },
        { headers: getAuthHeaders() }
      );
      toast.success("Result saved successfully!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to save result");
    }
  };

  const handleRecordScore = async (matchId, score1, score2) => {
    try {
      await api.put(
        `http://localhost:2020/api/v1/matches/${matchId}`,
        { scorePlayer1: parseInt(score1), scorePlayer2: parseInt(score2) },
        { headers: getAuthHeaders() }
      );
      toast.success("Scores recorded successfully!");
      fetchMatches(selectedLeague);
    } catch (error) {
      console.error("Error recording score:", error);
      toast.error("Failed to record scores");
    }
  };

  // ==================== DEADLINE & FORFEIT HANDLERS ====================

  const handleSetDeadline = async () => {
    if (!deadlineDate) {
      toast.warning("Please select a deadline date");
      return;
    }

    try {
      await api.put(
        `http://localhost:2020/api/v1/matches/${selectedMatch.id}/deadline`,
        { deadlineDate },
        { headers: getAuthHeaders() }
      );
      toast.success("Deadline set successfully!");
      setShowDeadlineModal(false);
      setDeadlineDate("");
      fetchMatches(selectedLeague);
      fetchOverdueMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set deadline");
    }
  };

  const handleRemoveDeadline = async (matchId) => {
    try {
      await api.delete(
        `http://localhost:2020/api/v1/matches/${matchId}/deadline`,
        { headers: getAuthHeaders() }
      );
      toast.success("Deadline removed!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to remove deadline");
    }
  };

  const handleForfeit = async () => {
    if (!forfeitPlayerId) {
      toast.warning("Please select a forfeiting player");
      return;
    }

    try {
      await api.post(
        `http://localhost:2020/api/v1/matches/${selectedMatch.id}/forfeit`,
        {
          forfeitingPlayerId: forfeitPlayerId,
          reason: forfeitReason || "No reason provided",
        },
        { headers: getAuthHeaders() }
      );
      toast.success("Match forfeited successfully!");
      setShowForfeitModal(false);
      setForfeitPlayerId("");
      setForfeitReason("");
      fetchMatches(selectedLeague);
      fetchOverdueMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to forfeit match");
    }
  };

  const openDeadlineModal = (match) => {
    setSelectedMatch(match);
    setDeadlineDate(match.deadlineDate || "");
    setShowDeadlineModal(true);
  };

  const openForfeitModal = (match) => {
    setSelectedMatch(match);
    setShowForfeitModal(true);
  };

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3] px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">League Matches</h2>
            <p className="text-gray-600 text-sm">Manage matches, deadlines, and results</p>
          </div>
          <button
            onClick={handleGenerateMatches}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Generate Matches
          </button>
        </div>

        {/* League Dropdown */}
        <LeagueDropdown onSelectLeague={setSelectedLeague} />

        {/* Overdue Alert */}
        {overdueMatches.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800">
                  {overdueMatches.length} Overdue Match{overdueMatches.length > 1 ? "es" : ""}
                </h3>
                <p className="text-sm text-red-700">
                  These matches have passed their deadline and need immediate attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Matches List */}
        {loading ? (
          <p className="mt-6 text-gray-600">Loading matches...</p>
        ) : (
          <MatchList
            matches={matches}
            onReschedule={handleReschedule}
            onRecordResult={handleRecordResult}
            onRecordScore={handleRecordScore}
            onSetDeadline={openDeadlineModal}
            onRemoveDeadline={handleRemoveDeadline}
            onForfeit={openForfeitModal}
          />
        )}

        {/* Set Deadline Modal */}
        {showDeadlineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Set Match Deadline</h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedMatch?.player1?.name} vs {selectedMatch?.player2?.name}
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Deadline Date</label>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSetDeadline}
                  className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg hover:bg-blue-600 font-medium"
                >
                  Set Deadline
                </button>
                <button
                  onClick={() => {
                    setShowDeadlineModal(false);
                    setDeadlineDate("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forfeit Modal */}
        {showForfeitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Forfeit Match</h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedMatch?.player1?.name} vs {selectedMatch?.player2?.name}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Who is forfeiting?</label>
                <select
                  value={forfeitPlayerId}
                  onChange={(e) => setForfeitPlayerId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select player...</option>
                  <option value={selectedMatch?.player1?.id}>
                    {selectedMatch?.player1?.name}
                  </option>
                  <option value={selectedMatch?.player2?.id}>
                    {selectedMatch?.player2?.name}
                  </option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Reason (optional)</label>
                <textarea
                  value={forfeitReason}
                  onChange={(e) => setForfeitReason(e.target.value)}
                  placeholder="Enter reason for forfeit..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  ⚠️ Warning: The forfeiting player will receive a 0-3 loss. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleForfeit}
                  disabled={!forfeitPlayerId}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  Confirm Forfeit
                </button>
                <button
                  onClick={() => {
                    setShowForfeitModal(false);
                    setForfeitPlayerId("");
                    setForfeitReason("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Match;