import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ArrowUp,
  Users,
  Plus,
  Edit,
  Eye,
  Download,
  FolderInput,
  ChartNoAxesColumnIncreasing,
  Loader2,
} from "lucide-react";
import SideBar from "../side-bar/SideBar";
import PlayerModal from "./PlayerModal";

const Player = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    newThisMonth: 0,
    newThisWeek: 0,
  });

  // API base URL
  const API_URL = "http://localhost:2020/api/v1/players";

  // Fetch players from API
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token if needed
        },
      });

      const playersData = response.data;
      
      // Sort players by points (descending)
      const sortedPlayers = playersData.sort((a, b) => b.points - a.points);
      
      // Add rank to each player
      const playersWithRank = sortedPlayers.map((player, index) => ({
        ...player,
        rank: `#${index + 1}`,
        winPercent: calculateWinPercentage(player),
        gamesPlayed: player.goalsScored + player.goalsConceded, // You can adjust this
        goalDifference: player.goalsScored - player.goalsConceded,
      }));

      setPlayers(playersWithRank);
      
      // Calculate stats
      calculateStats(playersWithRank);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Failed to load players. Please try again.");
      setLoading(false);
    }
  };

  // Calculate win percentage
  const calculateWinPercentage = (player) => {
    const totalMatches = player.points; // Assuming each win = 1 point
    if (totalMatches === 0) return "0%";
    // This is an estimation - you might need to adjust based on your data
    const winRate = (player.points / (player.points + 5)) * 100; // Simplified
    return `${Math.round(winRate)}%`;
  };

  // Calculate statistics
  const calculateStats = (playersData) => {
    const total = playersData.length;
    const active = playersData.filter((p) => p.points > 0).length;
    
    setStats({
      totalPlayers: total,
      activePlayers: active,
      newThisMonth: Math.floor(total * 0.13), // Example calculation
      newThisWeek: Math.floor(total * 0.8), // Example calculation
    });
  };

  // Load players on component mount
  useEffect(() => {
    fetchPlayers();
  }, []);

  // Handle player add/update
  const handlePlayerUpdate = () => {
    fetchPlayers(); // Refresh the list
  };

  // Export players to CSV
  const handleExport = () => {
    const csv = [
      ["Rank", "Name", "Phone", "Points", "Goals Scored", "Goals Conceded", "Goal Difference"],
      ...players.map((p) => [
        p.rank,
        p.name,
        p.phone,
        p.points,
        p.goalsScored,
        p.goalsConceded,
        p.goalDifference,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "players.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="flex">
        <div className="fixed top-0 left-0 w-64 h-screen z-50">
          <SideBar />
        </div>
        <div className="ml-64 flex-1 h-screen flex items-center justify-center bg-[#F2F3F3]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#288f5f] mx-auto mb-4" />
            <p className="text-gray-600">Loading players...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <div className="fixed top-0 left-0 w-64 h-screen z-50">
          <SideBar />
        </div>
        <div className="ml-64 flex-1 h-screen flex items-center justify-center bg-[#F2F3F3]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPlayers}
              className="bg-[#288f5f] text-white px-6 py-2 rounded-lg hover:bg-[#1f6f4c]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3]">
        <div className="flex-1 px-6 bg-[#F2F3F3] pb-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[30px] font-medium text-[#101828]">
                Player Management
              </h2>
              <p className="text-[#667085] text-[16px] font-normal mb-[20px]">
                Manage all league players, statistics, and information
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#288f5f] text-white px-4 py-2 rounded-lg hover:bg-[#1f6f4c] transition"
              >
                <Plus className="inline-block mr-2" />
                Player
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-6">
            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Players
                  </div>
                  <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                    <div className="bg-green-200 rounded-full p-1 hover:bg-green-300 transition">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  {stats.totalPlayers}
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUp className="text-green-500 w-4 h-4" />
                  <span className="text-green-600 font-semibold text-sm">
                    +{stats.newThisMonth}
                  </span>
                  <span className="font-medium text-[14px] text-green-600">
                    this month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Active Players
                  </div>
                  <div className="bg-blue-100 text-[#004cff] rounded-full p-2 hover:bg-blue-200 transition">
                    <div className="bg-blue-200 rounded-full p-1 hover:bg-blue-300 transition">
                      <ChartNoAxesColumnIncreasing className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  {stats.activePlayers}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold text-sm">
                    +{stats.newThisWeek}
                  </span>
                  <span className="font-medium text-[14px] text-blue-600">
                    this week
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Section */}
          <Card className="rounded-2xl shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[24px] font-medium text-[#101828]">
                  All Players ({players.length})
                </CardTitle>
                <div className="flex gap-3">
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                    <FolderInput className="w-4 h-4" />
                    Import
                  </button>
                  <button
                    onClick={handleExport}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Win %
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Goals Scored
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Goals Conceded
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Goal Difference
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                          No players found. Add your first player!
                        </td>
                      </tr>
                    ) : (
                      players.map((player) => (
                        <tr
                          key={player.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {player.rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                {player.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {player.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Player {player.rank}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {player.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {player.points} pts
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {player.winPercent}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {player.goalsScored}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {player.goalsConceded}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span
                              className={
                                player.goalDifference > 0
                                  ? "text-green-600"
                                  : player.goalDifference < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }
                            >
                              {player.goalDifference > 0 ? "+" : ""}
                              {player.goalDifference}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button className="text-[#667085] hover:text-blue-600 transition">
                                <Eye className="w-5 h-5" />
                              </button>
                              <button className="text-[#667085] hover:text-green-600 transition">
                                <Edit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handlePlayerUpdate}
      />
    </div>
  );
};

export default Player;