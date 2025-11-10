import React, { useState, useEffect } from "react";
import { X, Trophy, Calendar, Users, TrendingUp, Loader2, Award } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PlayerMatchesModal = ({ isOpen, onClose, player }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    won: 0,
    lost: 0,
  });

  const { user } = useSelector((state) => state.reducer.auth);
  const token = user?.payload?.tokens?.accessToken;

  const API_URL = "http://localhost:2020/api/v1";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // Fetch leagues
  useEffect(() => {
    if (isOpen && player) {
      fetchLeagues();
    }
  }, [isOpen, player]);

  // Fetch matches based on active tab
  useEffect(() => {
    if (isOpen && player) {
      fetchMatches();
    }
  }, [activeTab, selectedLeague, isOpen, player]);

  const fetchLeagues = async () => {
    try {
      const response = await axios.get(`${API_URL}/leagues`, {
        headers: getAuthHeaders(),
      });
      const leaguesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setLeagues(leaguesData);
    } catch (error) {
      console.error("Error fetching leagues:", error);
    }
  };

  const fetchMatches = async () => {
    if (!player?.id) return;

    setLoading(true);
    try {
      let endpoint = "";

      if (activeTab === "league" && selectedLeague) {
        endpoint = `${API_URL}/matches/player/${player.id}/league/${selectedLeague}`;
      } else if (activeTab === "all") {
        endpoint = `${API_URL}/matches/player/${player.id}`;
      } else if (activeTab === "pending") {
        endpoint = `${API_URL}/matches/player/${player.id}/pending`;
      } else if (activeTab === "completed") {
        endpoint = `${API_URL}/matches/player/${player.id}/completed`;
      }

      const response = await axios.get(endpoint, {
        headers: getAuthHeaders(),
      });

      const matchesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setMatches(matchesData);
      calculateStats(matchesData);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (matchesData) => {
    const total = matchesData.length;
    const completed = matchesData.filter((m) => m.winner !== null).length;
    const pending = matchesData.filter((m) => m.winner === null).length;
    const won = matchesData.filter((m) => m.winner?.id === player.id).length;
    const lost = completed - won;

    setStats({ total, completed, pending, won, lost });
  };

  const isPlayerWinner = (match) => {
    return match.winner?.id === player.id;
  };

  const getMatchResult = (match) => {
    if (!match.winner) return "Pending";
    return isPlayerWinner(match) ? "Won" : "Lost";
  };

  const getResultColor = (match) => {
    if (!match.winner) return "bg-yellow-100 text-yellow-800";
    return isPlayerWinner(match) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getOpponent = (match) => {
    if (match.player1.id === player.id) {
      return match.player2;
    }
    return match.player1;
  };

  const getPlayerScore = (match) => {
    if (match.player1.id === player.id) {
      return match.scorePlayer1;
    }
    return match.scorePlayer2;
  };

  const getOpponentScore = (match) => {
    if (match.player1.id === player.id) {
      return match.scorePlayer2;
    }
    return match.scorePlayer1;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-green-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white text-green-600 flex items-center justify-center text-2xl font-bold">
              {player?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{player?.name}</h2>
              <p className="text-green-100">{player?.phone}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-3 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-xs text-green-100">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-xs text-green-100">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-xs text-green-100">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-xs text-green-100">Won</p>
              <p className="text-2xl font-bold text-yellow-300">{stats.won}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-xs text-green-100">Lost</p>
              <p className="text-2xl font-bold">{stats.lost}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "all"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "pending"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "completed"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("league")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "league"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              By League
            </button>
          </div>
        </div>

        {/* League Filter (shown only in league tab) */}
        {activeTab === "league" && (
          <div className="p-4 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select League
            </label>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Choose a league --</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No matches found</p>
              <p className="text-gray-400 text-sm mt-2">
                {activeTab === "league" && !selectedLeague
                  ? "Please select a league"
                  : "This player hasn't played any matches yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => {
                const opponent = getOpponent(match);
                const playerScore = getPlayerScore(match);
                const opponentScore = getOpponentScore(match);
                const result = getMatchResult(match);

                return (
                  <div
                    key={match.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(match.scheduledDate)}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {match.round}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getResultColor(match)}`}>
                        {result}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      {/* Player */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{player.name}</p>
                          <p className="text-xs text-gray-500">You</p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-3xl font-bold text-gray-900">{playerScore}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-3xl font-bold text-gray-900">{opponentScore}</span>
                        </div>
                        {match.winner && (
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Award className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-gray-600">
                              Winner: {match.winner.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Opponent */}
                      <div className="flex items-center gap-3 justify-end">
                        <div className="flex-1 text-right">
                          <p className="font-semibold text-gray-900">{opponent.name}</p>
                          <p className="text-xs text-gray-500">Opponent</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                          {opponent.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Deadline Info */}
                    {match.deadlineDate && !match.winner && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-orange-600">
                          <TrendingUp className="w-3 h-3" />
                          <span>Deadline: {formatDate(match.deadlineDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerMatchesModal;